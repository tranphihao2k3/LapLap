import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

const fakeReviews = [
    {
        userName: "Nguyễn Văn Hùng",
        rating: 5,
        comment: "Mới mua con Dell XPS ở đây, máy đẹp keng như mới. Shop tư vấn nhiệt tình, có tâm. Sẽ ủng hộ dài dài.",
        createdAt: new Date("2023-11-15T10:00:00Z"),
        reply: {
            content: "Cảm ơn anh Hùng đã tin tưởng ủng hộ Laptop Cần Thơ ạ! Chúc anh dùng máy bền tốt nhé.",
            repliedAt: new Date("2023-11-15T13:30:00Z")
        }
    },
    {
        userName: "Trần Thị Lan Anh",
        rating: 5,
        comment: "Mình là sinh viên, được anh chủ tư vấn con máy vừa túi tiền mà chạy mượt các phần mềm học tập. Cảm ơn shop nhiều lắm!",
        createdAt: new Date("2023-12-05T09:15:00Z"),
        reply: {
            content: "Dạ cảm ơn bạn Lan Anh, chúc bạn học tập thật tốt nha! Cần hỗ trợ gì cứ nhắn shop nhé.",
            repliedAt: new Date("2023-12-05T10:00:00Z")
        }
    },
    {
        userName: "Lê Minh Tuấn",
        rating: 4,
        comment: "Máy móc ổn định, giá cả hợp lý so với mặt bằng chung ở Cần Thơ. Góp ý nhỏ là shop nên có thêm nhiều mẫu gaming hơn.",
        createdAt: new Date("2024-01-10T14:20:00Z"),
        reply: {
            content: "Chào anh Tuấn, cảm ơn anh đã góp ý ạ. Shop đang về thêm lô Gaming mới, mời anh ghé xem nhé!",
            repliedAt: new Date("2024-01-11T08:00:00Z")
        }
    },
    {
        userName: "Phạm Thanh Hằng",
        rating: 5,
        comment: "Dịch vụ sau bán hàng quá tuyệt vời. Máy mình bị lỗi win mang ra được cài lại miễn phí ngay, nhân viên vui vẻ.",
        createdAt: new Date("2024-01-20T16:45:00Z")
    },
    {
        userName: "Hoàng Đức",
        rating: 5,
        comment: "Uy tín đặt lên hàng đầu. Đã mua cái thứ 2 ở đây cho em trai, vẫn rất hài lòng về chất lượng.",
        createdAt: new Date("2024-02-01T11:10:00Z"),
        reply: {
            content: "Cảm ơn anh Đức khách quen ạ! Sự tin tưởng của anh là động lực lớn nhất của tụi em.",
            repliedAt: new Date("2024-02-01T12:00:00Z")
        }
    },
    {
        userName: "Võ Văn Kiệt",
        rating: 5,
        comment: "Shop làm việc rất chuyên nghiệp. Ship hàng nhanh, đóng gói cẩn thận. Máy nhận về đúng như mô tả trên web.",
        createdAt: new Date("2024-02-12T08:30:00Z")
    },
    {
        userName: "Đặng Thùy Dung",
        rating: 4,
        comment: "Mình mua máy cũ mà ngoại hình còn mới lắm, pin cũng trâu. Chỉ có điều quán hơi khó tìm xíu hihi.",
        createdAt: new Date("2024-03-05T15:00:00Z"),
        reply: {
            content: "Hì, dạ do shop nằm trong hẻm nên hơi khuất xíu ạ. Cảm ơn Dung đã chịu khó ghé shop nha <3",
            repliedAt: new Date("2024-03-05T16:30:00Z")
        }
    },
    {
        userName: "Ngô Kiến Huy",
        rating: 5,
        comment: "10 điểm cho sự nhiệt tình. Mình không rành công nghệ lắm nhờ shop chọn dùm, xài 3 tháng nay thấy rất OK.",
        createdAt: new Date("2024-03-15T09:45:00Z")
    },
    {
        userName: "Bùi Bích Phương",
        rating: 5,
        comment: "Giá tốt nhất Cần Thơ rồi. Đi tham khảo mấy chỗ thấy ở đây máy đẹp mà giá mềm hơn hẳn. Ủng hộ shop.",
        createdAt: new Date("2024-04-02T13:20:00Z")
    },
    {
        userName: "Tài Nguyễn",
        rating: 5,
        comment: "Anh chủ dễ tính, fix giá nhiệt tình cho sinh viên. Máy chạy ngon lành cành đào.",
        createdAt: new Date("2024-04-10T10:10:00Z")
    },
    {
        userName: "Mai Phương Thúy",
        rating: 4,
        comment: "Mua máy được tặng kèm nhiều quà: chuột, túi, lót chuột. Thích nhất là chế độ bảo hành rõ ràng, yên tâm.",
        createdAt: new Date("2024-04-18T14:50:00Z")
    },
    {
        userName: "Trần Bảo Sơn",
        rating: 5,
        comment: "Đã giới thiệu bạn bè qua mua, ai cũng khen. Chúc shop ngày càng phát triển nhé!",
        createdAt: new Date("2024-04-25T08:00:00Z")
    },
    {
        userName: "Lâm Chấn Khang",
        rating: 5,
        comment: "Máy zin all chưa qua sửa chữa, thợ test phát là biết ngay. Hàng chất lượng, anh em yên tâm mua.",
        createdAt: new Date("2024-05-01T11:30:00Z")
    },
    {
        userName: "Khách Vãng Lai",
        rating: 5,
        comment: "Ghé vệ sinh máy thôi mà cũng được tiếp đón niềm nở. Lần sau có mua máy nhất định sẽ ghé lại.",
        createdAt: new Date("2024-05-05T16:15:00Z")
    }
];

export async function GET() {
    try {
        await connectDB();

        // Loop and add each review
        const createdReviews = [];
        for (const review of fakeReviews) {
            // Check if similar review exists to prevent duplicates on multiple runs (optional)
            const exists = await Review.findOne({ userName: review.userName, comment: review.comment });
            if (!exists) {
                const newReview = await Review.create({
                    ...review,
                    status: "approved",
                    isVerifiedPurchase: true, // Mark as verified for credibility
                });
                createdReviews.push(newReview);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${createdReviews.length} reviews`,
            data: createdReviews
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
