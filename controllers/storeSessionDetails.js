import Session from "../models/sessionModel.js";

export const storeSessionDetails = async (sessionData) => {
  console.log(sessionData, "sessionData");

  try {
    // Extract relevant data from the sessionData object
    const {
      id: sessionId,
      customer_details: {
        email: customerEmail,
        name: customerName,
        address: customerAddress,
      } = {},
      line_items: rawLineItems = [],
      amount_subtotal: amountSubtotal,
      amount_total: amountTotal,
      currency,
      payment_status: paymentStatus,
      created,
      status,
    } = sessionData;

    // Format line items to match the schema
    const lineItems = rawLineItems.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      amountTotal: item.amount_total,
      priceId: item.price_id,
      unitAmount: item.unit_amount,
      currency: item.currency,
      productId: item.product_id,
      productName: item.product_name,
      productImages: item.product_images,
    }));

    // Create a new session document
    const session = new Session({
      sessionId,
      customerEmail,
      customerName,
      customerAddress,
      lineItems,
      amountSubtotal,
      amountTotal,
      currency,
      paymentStatus,
      created: new Date(created * 1000), // Convert Stripe timestamp to JavaScript Date
      status,
    });

    // Save the session document to the database
    const savedSession = await session.save();
    return savedSession;
  } catch (error) {
    console.error("Error storing session details:", error);
    throw new Error("Unable to store session details");
  }
};
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({});
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getSessionsByEmail = async (req, res) => {
    // const { email } = req.user; // Extract email from the authenticated user object
    const email = req.user.email;
    try {
      const sessions = await Session.find({ customerEmail: email });
      if (sessions.length === 0) {
        return res.status(404).json({ message: 'No sessions found for this email' });
      }
      res.status(200).json(sessions);
    } catch (error) {
      console.error('Error fetching sessions by email:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  export const updateDeliveryInfo = async (req, res) => {
    const { sessionId } = req.params;
    const { deliveryStatus, estimatedDeliveryTime, deliveryLocation } = req.body;
  
    try {
      const updatedSession = await Session.findOneAndUpdate(
        { sessionId },
        { deliveryStatus, estimatedDeliveryTime, deliveryLocation },
        { new: true } // Return the updated document
      );
  
      if (!updatedSession) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.json(updatedSession);
    } catch (error) {
      console.error('Error updating delivery information:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };