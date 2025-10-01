"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const contactModel_1 = require("../model/contactModel");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a new contact message
const createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        // Validate required fields
        if (!name || !email || !message) {
            res.status(400).json({ message: 'Name, email, and message are required.' });
            return;
        }
        // Save contact in DB
        const newContact = new contactModel_1.Contact({
            name,
            email,
            phone,
            message,
        });
        await newContact.save();
        console.log('✅ Contact saved to database');
        // 1. Notify admin
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            console.log('🚀 Sending email to admin...');
            await (0, sendEmail_1.default)(adminEmail, 'New Contact Message Received', `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong> ${message}</p>
        `, email // Reply-to will be the sender's email
            );
            console.log('✅ Admin notification sent');
        }
        // 2. Send confirmation email to the user
        console.log('🚀 Sending confirmation email to user...');
        await (0, sendEmail_1.default)(email, 'We Received Your Message', `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Contacting Us!</h2>
          <p>Hi ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #666; margin-top: 0;">Your Message:</h3>
            <p style="color: #333;">${message}</p>
          </div>
          
          <p>Our team typically responds within 24-48 hours.</p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            Your Team
          </p>
        </div>
      `, adminEmail // Reply-to will be the admin email
        );
        console.log('✅ Confirmation email sent to user');
        res.status(201).json({
            message: 'Contact message saved successfully. Confirmation email sent.',
            contact: newContact,
        });
    }
    catch (error) {
        console.error('❌ Error creating contact:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.createContact = createContact;
