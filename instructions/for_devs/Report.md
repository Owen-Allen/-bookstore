

Conceptual Design
This section should explain the conceptual design of the database. That is, the ER-diagram of the database
for the bookstore and explanation of all the assumptions made in the diagram regarding cardinalities and
participation types. Make sure that the assumptions do not contradict with the problem statement in Section 1.

Assumptions:
A user, who's data is stored in user_account, can place multiple orders, specified by user_order.  The user_account specifies the default shipping and billing info for that user, as well as their name and id.  The participation between user_account and user_order is partial, since a user does not need to place an order.

user_order contains the info about a specific order made by the user.  The user_id of the person who placed the order is specified by the user_id.  The details about the order's current location are stored in order_location.  The billing information is stored in billing_info, and it was assumed that the address to send the order to can be different from the billing address, so the destination is stored seperately. Each user_order must have a corresponding order_object that specifies the the books the user ordered.

The participation between user_order and order_object is total, since every user_order requires at least 1 order_object and all order_objects need to have a user_order.

