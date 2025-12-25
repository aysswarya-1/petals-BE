import asyncHandler from "../middlewares/asyncHandler.js";
import InquiryService from "../services/inquiry.service.js";

class InquiryController {
    create = asyncHandler(async (req, res) => {
        const data = {
            user: req.user?.id || null,
            type: req.body.type,             // must be 'contact' or 'consultation'
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fullName: req.body.fullName || `${req.body.firstName} ${req.body.lastName}`,
            email: req.body.email,
            phone: req.body.phone,
            inquiryPurpose: req.body.inquiryPurpose,
            preferredDate: req.body.preferredDate,
            message: req.body.message,
            eventDate: req.body.eventDate,
            guestCount: req.body.guestCount,
            venue: req.body.venue,
            city: req.body.city,
            budgetRange: req.body.budgetRange,
            vision: req.body.vision,
            pinterestLink: req.body.pinterestLink,
            product: req.body.product || null,
            // orderId: req.body.orderId || null
        };

        const inquiry = await InquiryService.create(data);
        res.status(201).json({ success: true, inquiry });
    });

    getMyInquiries = asyncHandler(async (req, res) => {
        const inquiries = await InquiryService.getMyInquiries(req.user?.id);
        res.json({ success: true, inquiries });
    });

    adminGetAll = asyncHandler(async (req, res) => {
        const inquiries = await InquiryService.adminGetAll();
        res.json({ success: true, inquiries });
    });

    updateStatus = asyncHandler(async (req, res) => {
        const updated = await InquiryService.updateStatus(req.params.id, req.body.status);
        res.json({ success: true, inquiry: updated });
    });
}

export default new InquiryController();
