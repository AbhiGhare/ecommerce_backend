import Stripe from 'stripe';
import dotenv from 'dotenv';
import { storeSessionDetails } from './storeSessionDetails.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async(req,res)=>{
  const {products} = req.body;

  const lineItems = products.map((product)=>({
      price_data:{
          currency:"inr",
          product_data:{
              name:product.dish,
              images:[product.imgdata]
          },
          unit_amount:product.price * 100,
      },
      quantity:product.qnty
  }));

  const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:lineItems,
      mode:"payment",
      success_url: "http://localhost:5173/success/{CHECKOUT_SESSION_ID}",
      cancel_url:"http://localhost:5173/cancel",
      shipping_address_collection: {
        allowed_countries: ['IN', 'US', 'CA'], // Add allowed countries (IN for India, US for United States, CA for Canada, etc.)
      },
      billing_address_collection: 'required'
  });

  res.json({id:session.id})

}

/**
 * Fetch all orders from Stripe.
 */
// export const getAllStripeOrders = async (req, res) => {
//   try {
//     const sessions = await stripe.checkout.sessions.list({
//       limit: 100, // Specify the number of sessions to retrieve
//     });
    
//     res.status(200).json(sessions.data);
//   } catch (error) {
//     console.error('Error fetching sessions from Stripe:', error);
//     res.status(500).json({ error: 'Failed to fetch sessions from Stripe' });
//   }
// };
export const getAllStripeOrders = async (req, res) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100, // Specify the number of payment intents to retrieve
    });
    
    res.status(200).json(paymentIntents.data);
  } catch (error) {
    console.error('Error fetching payment intents from Stripe:', error);
    res.status(500).json({ error: 'Failed to fetch payment intents from Stripe' });
  }
};
export const getAllTransactions = async (req, res) => {
  try {
    const { limit, starting_after } = req.query;

    // Fetch transactions with optional pagination parameters
    const transactions = await stripe.balanceTransactions.list({
      limit: limit || 100, // Maximum number of transactions to return
      starting_after: starting_after || undefined, // Pagination cursor
    });

    res.status(200).json(transactions.data);
  } catch (error) {
    console.error('Error fetching transactions from Stripe:', error);
    res.status(500).json({ error: 'Failed to fetch transactions from Stripe' });
  }
};
// export const getAllPayments = async (req, res) => {
//   try {
//     const { limit, starting_after } = req.query;

//     // Fetch balance transactions with optional pagination parameters
//     const transactions = await stripe.balanceTransactions.list({
//       limit: limit || 10, // Maximum number of transactions to return (max is 100)
//       starting_after: starting_after || undefined, // Pagination cursor
//     });

//     res.status(200).json(transactions.data);
//   } catch (error) {
//     console.error('Error fetching transactions from Stripe:', error);
//     res.status(500).json({ error: 'Failed to fetch transactions from Stripe' });
//   }
// };
export const getAllPayments = async (req, res) => {
  try {
    // Fetch all payment intents
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100, // You can adjust this limit
    });

    // Extract relevant data from each payment intent
    const paymentsData = paymentIntents.data.map(async (paymentIntent) => {
      // Get the latest charge from paymentIntent
      const chargeId = paymentIntent.latest_charge;

      if (chargeId) {
        const charge = await stripe.charges.retrieve(chargeId);
        const paymentMethod = paymentIntent.payment_method_types[0]; // E.g., 'card'
        
        // Retrieve invoice or receipt details if applicable
        const invoice = paymentIntent.invoice ? await stripe.invoices.retrieve(paymentIntent.invoice) : null;

        return {
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Stripe amounts are in cents
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          email: paymentIntent.receipt_email || charge.billing_details.email,
          address: charge.billing_details.address,
          created: new Date(paymentIntent.created * 1000), // Convert UNIX timestamp to Date
          paymentMethod,
          customer: {
            name: charge.billing_details.name,
            email: charge.billing_details.email,
            address: charge.billing_details.address,
            country: charge.billing_details.address?.country,
          },
          items: invoice ? invoice.lines.data.map(line => ({
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.amount / line.quantity / 100, // Calculate unit price
            amount: line.amount / 100, // Total amount for this line item
          })) : [], // If no invoice, no items
        };
      }

      return null;
    });

    // Await for all the data to be fetched
    const allPayments = await Promise.all(paymentsData);

    // Filter out any null values (in case there were no charges)
    const filteredPayments = allPayments.filter(payment => payment !== null);

    res.json(filteredPayments);

  } catch (error) {
    console.error('Error fetching payment data:', error);
    res.status(500).json({ error: 'Failed to fetch payment data' });
  }
};

export const retrieve=async(req,res)=>{
  
  const { sessionId } = req.params;

  try {
      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['line_items.data.price.product'] // Expand the product details
      });

      // Extract line items from the session
      const lineItems = session.line_items.data.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          amount_total: item.amount_total,
          price_id: item.price.id,
          unit_amount: item.price.unit_amount,
          currency: item.currency,
          product_id: item.price.product.id,
          product_name: item.price.product.name,
          product_images: item.price.product.images, // Include images here
      }));

      // Combine session details with enriched line item data
      const sessionDetails = {
          ...session,
          line_items: lineItems
      };

      const storedSession = await storeSessionDetails(sessionDetails);

      // Send the stored session back to the client
      res.json(storedSession);
      // res.json(sessionDetails);

  } catch (error) {
      console.error('Error fetching session details:', error);
      res.status(500).json({ error: 'Unable to fetch session details' });
  }
}
