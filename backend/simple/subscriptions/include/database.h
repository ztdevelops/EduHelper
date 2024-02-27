#ifndef DATABASE_H
#define DATABASE_H

#include <pqxx/pqxx>
#include <dotenv.h>
#include "../pb/subscriptions.pb.h"

class Database
{
public:
    static Database &getInstance();

    subscription_pb::SubscriptionMessage getSubscriptionByUserId(const std::string &user_id);
    subscription_pb::SubscriptionMessage createOrUpdateSubscriptionByUserId(const std::string &user_id, const time_t subscribed_until);
    std::vector<subscription_pb::SubscriptionMessage> getExpiredSubscriptions();
    subscription_pb::SubscriptionMessage deleteSubscriptionByUserId(const std::string &user_id);

private:
    pqxx::connection conn;

    Database();
    Database(const Database &) = delete;
    Database &operator=(const Database &) = delete;
};

#endif