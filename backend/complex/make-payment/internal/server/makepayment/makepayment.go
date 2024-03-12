package makepayment

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/url"
	"os"
	"strings"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/client"
	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/utils"
	makepaymentPb "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/make_payment"
	subscriptionPb "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/subscription"
)

type Server struct {
	makepaymentPb.UnimplementedMakePaymentServiceServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Checkout(ctx context.Context, req *makepaymentPb.CheckoutRequest) (*makepaymentPb.CheckoutResponse, error) {
	paymentServiceHost := os.Getenv("PAYMENT_SERVICE_HOST")
	paymentServicePort := os.Getenv("PAYMENT_SERVICE_PORT")
	checkoutURL := fmt.Sprintf("http://%s:%s/checkout", paymentServiceHost, paymentServicePort)

	data := url.Values{}
	data.Set("email", req.Email)
	dataReader := strings.NewReader(data.Encode())

	httpResp, err := utils.SendHttpRequest(ctx, "GET", checkoutURL, dataReader, nil)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "error sending request: %v", err)
	}
	defer httpResp.Body.Close()

	bodyBytes, err := io.ReadAll(httpResp.Body)
	if err != nil {
		log.Printf("Failed to read HTTP response body: %v", err)
		return nil, status.Errorf(codes.Internal, "error reading HTTP response body: %v", err)
	}

	var respBody map[string]string
	err = json.Unmarshal(bodyBytes, &respBody)
	if err != nil {
		log.Printf("Failed to unmarshal HTTP response body: %v", err)
		return nil, status.Errorf(codes.Internal, "error unmarshalling HTTP response body: %v", err)
	}

	stripeRedirectURL, ok := respBody["url"]
	if !ok {
		log.Printf("URL not found in HTTP response body")
		return nil, status.Errorf(codes.Internal, "URL not found in HTTP response body")
	}

	return &makepaymentPb.CheckoutResponse{Url: stripeRedirectURL}, nil
}

func (s *Server) SuccessfulPayment(ctx context.Context, req *makepaymentPb.SuccessfulPaymentRequest) (*makepaymentPb.SuccessfulPaymentResponse, error) {
	var stripeSignature string
	if md, ok := metadata.FromIncomingContext(ctx); ok {
		var values []string

		if values = md["stripe-signature"]; len(values) == 0 {
			log.Printf("Stripe signature not found in metadata")
			return nil, status.Errorf(codes.InvalidArgument, "Stripe signature not found in metadata")
		}

		stripeSignature = values[0]
	}

	paymentServiceHost := os.Getenv("PAYMENT_SERVICE_HOST")
	paymentServicePort := os.Getenv("PAYMENT_SERVICE_PORT")
	webhookURL := fmt.Sprintf("http://%s:%s/webhook", paymentServiceHost, paymentServicePort)
	dataReader := strings.NewReader(string(req.Raw))

	headerData := map[string]string{
		"Content-Type":     "application/json", // Overwrite content-type for stripe webhook
		"stripe-signature": stripeSignature,
	}

	httpResp, err := utils.SendHttpRequest(ctx, "POST", webhookURL, dataReader, headerData)
	if err != nil || httpResp.StatusCode != 200 {
		log.Printf("Failed to validate stripe webhook request")
		return nil, status.Errorf(codes.Internal, "error validating stripe webhook request")
	}

	defer httpResp.Body.Close()

	bodyBytes, err := io.ReadAll(httpResp.Body)
	if err != nil {
		log.Printf("Failed to read HTTP response body: %v", err)
		return nil, status.Errorf(codes.Internal, "error reading HTTP response body: %v", err)
	}

	var respBody map[string]string
	err = json.Unmarshal(bodyBytes, &respBody)
	if err != nil {
		log.Printf("Failed to unmarshal HTTP response body: %v", err)
		return nil, status.Errorf(codes.Internal, "error unmarshalling HTTP response body: %v", err)
	}

	customerEmail, ok := respBody["email"]
	if !ok {
		log.Printf("Email not found in HTTP response body")
		return nil, status.Errorf(codes.Internal, "email not found in HTTP response body")
	}

	subscriptionClient := client.GetClient()
	oneMonthFromNow := time.Now().AddDate(0, 1, 0)
	timestamp := timestamppb.New(oneMonthFromNow)

	stubReq := &subscriptionPb.CreateOrUpdateSubscriptionRequest{
		Email:           customerEmail,
		SubscribedUntil: timestamp,
	}

	stubResp, err := subscriptionClient.Stub.CreateOrUpdateSubscription(ctx, stubReq)
	if err != nil {
		log.Printf("Failed to create or update subscription: %v", err)
		return nil, status.Errorf(codes.Internal, "error creating or updating subscription: %v", err)
	}

	return &makepaymentPb.SuccessfulPaymentResponse{SubscribedUntil: stubResp.Details.SubscribedUntil}, nil
}

// import (
//     "context"
//     "google.golang.org/grpc"
//     "log"
//     "os"
// )
//
// Change PaymentServiceClient name to replace 
// makepaymentPb.PaymentServiceClient, makepaymentPb.CheckoutGrpcRequest, makepaymentPb.WebhookGrpcRequest 
// with the actual gRPC client and request message types defined in your proto file. 
// Also, ensure that the payment service has the necessary gRPC server running and the methods Checkout and Webhook implemented.
//
// type Server struct {
//     PaymentServiceClient makepaymentPb.PaymentServiceClient
// }

// func NewServer() *Server {
//     paymentServiceHost := os.Getenv("PAYMENT_SERVICE_HOST")
//     paymentServicePort := os.Getenv("PAYMENT_SERVICE_PORT")
//     conn, err := grpc.Dial(fmt.Sprintf("%s:%s", paymentServiceHost, paymentServicePort), grpc.WithInsecure())
//     if err != nil {
//         log.Fatalf("Failed to connect to payment service: %v", err)
//     }
//     client := makepaymentPb.NewPaymentServiceClient(conn)

//     return &Server{PaymentServiceClient: client}
// }

// func (s *Server) Checkout(ctx context.Context, req *makepaymentPb.CheckoutRequest) (*makepaymentPb.CheckoutResponse, error) {
//     grpcReq := &makepaymentPb.CheckoutGrpcRequest{Email: req.Email}
//     grpcResp, err := s.PaymentServiceClient.Checkout(ctx, grpcReq)
//     if err != nil {
//         return nil, status.Errorf(codes.Internal, "error sending request: %v", err)
//     }

//     return &makepaymentPb.CheckoutResponse{Url: grpcResp.Url}, nil
// }

// func (s *Server) SuccessfulPayment(ctx context.Context, req *makepaymentPb.SuccessfulPaymentRequest) (*makepaymentPb.SuccessfulPaymentResponse, error) {
//     var stripeSignature string
//     if md, ok := metadata.FromIncomingContext(ctx); ok {
//         var values []string

//         if values = md["stripe-signature"]; len(values) == 0 {
//             log.Printf("Stripe signature not found in metadata")
//             return nil, status.Errorf(codes.InvalidArgument, "Stripe signature not found in metadata")
//         }

//         stripeSignature = values[0]
//     }

//     grpcReq := &makepaymentPb.WebhookGrpcRequest{Raw: req.Raw, StripeSignature: stripeSignature}
//     grpcResp, err := s.PaymentServiceClient.Webhook(ctx, grpcReq)
//     if err != nil {
//         log.Printf("Failed to validate stripe webhook request")
//         return nil, status.Errorf(codes.Internal, "error validating stripe webhook request")
//     }

//     subscriptionClient := client.GetClient()
//     oneMonthFromNow := time.Now().AddDate(0, 1, 0)
//     timestamp := timestamppb.New(oneMonthFromNow)

//     stubReq := &subscriptionPb.CreateOrUpdateSubscriptionRequest{
//         Email:           grpcResp.Email,
//         SubscribedUntil: timestamp,
//     }

//     stubResp, err := subscriptionClient.Stub.CreateOrUpdateSubscription(ctx, stubReq)
//     if err != nil {
//         log.Printf("Failed to create or update subscription: %v", err)
//         return nil, status.Errorf(codes.Internal, "error creating or updating subscription: %v", err)
//     }

//     return &makepaymentPb.SuccessfulPaymentResponse{SubscribedUntil: stubResp.Details.SubscribedUntil}, nil
// }