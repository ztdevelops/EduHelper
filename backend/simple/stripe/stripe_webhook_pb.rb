# frozen_string_literal: true
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: stripe_webhook.proto

require 'google/protobuf'


descriptor_data = "\n\x14stripe_webhook.proto\")\n\x0bStripeEvent\x12\x0c\n\x04type\x18\x01 \x01(\t\x12\x0c\n\x04\x64\x61ta\x18\x02 \x01(\t\"\x1e\n\x0f\x43heckoutSession\x12\x0b\n\x03url\x18\x01 \x01(\t\"\x07\n\x05\x45mpty2o\n\rStripeWebhook\x12)\n\tSendEvent\x12\x0c.StripeEvent\x1a\x0c.StripeEvent\"\x00\x12\x33\n\x15\x43reateCheckoutSession\x12\x06.Empty\x1a\x10.CheckoutSession\"\x00\x62\x06proto3"

pool = Google::Protobuf::DescriptorPool.generated_pool

begin
  pool.add_serialized_file(descriptor_data)
rescue TypeError
  # Compatibility code: will be removed in the next major version.
  require 'google/protobuf/descriptor_pb'
  parsed = Google::Protobuf::FileDescriptorProto.decode(descriptor_data)
  parsed.clear_dependency
  serialized = parsed.class.encode(parsed)
  file = pool.add_serialized_file(serialized)
  warn "Warning: Protobuf detected an import path issue while loading generated file #{__FILE__}"
  imports = [
  ]
  imports.each do |type_name, expected_filename|
    import_file = pool.lookup(type_name).file_descriptor
    if import_file.name != expected_filename
      warn "- #{file.name} imports #{expected_filename}, but that import was loaded as #{import_file.name}"
    end
  end
  warn "Each proto file must use a consistent fully-qualified name."
  warn "This will become an error in the next major version."
end

StripeEvent = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("StripeEvent").msgclass
CheckoutSession = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("CheckoutSession").msgclass
Empty = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("Empty").msgclass
