import Inquiry from "../models/inquiry.model.js";

class InquiryService {
    async create(data) {
        return await Inquiry.create(data);
    }

    async getMyInquiries(userId) {
        return await Inquiry.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate({ path: "product", select: "title price images" })
        // .populate({ path: "orderId", select: "orderNumber total" });
    }

    async adminGetAll() {
        return await Inquiry.find()
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "fullName email" })
            .populate({ path: "product", select: "title price images" })
        // .populate({ path: "orderId", select: "orderNumber total" });
    }

    async updateStatus(id, status) {
        return await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    }
}

export default new InquiryService();
