import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type = 'trade-in', ...data } = body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let subject = '';
        let htmlContent = '';

        if (type === 'repair') {
            const name = data.name || data.customerName || 'Khách hàng';
            const contact = data.contact || data.customerPhone || 'Không có sđt';
            const model = data.model || data.productModel || (data.productInfo ? `${data.productInfo.brand} ${data.productInfo.model}` : 'Máy');
            const issue = data.issue || data.issueDescription || 'Cần kiểm tra';
            const notes = data.notes || '';
            subject = `🛠️ ĐẶT LỊCH SỬA CHỮA: ${model} - ${contact}`;
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                        .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
                        .content { padding: 30px; }
                        .info-group { margin-bottom: 20px; }
                        .info-item { padding: 12px 0; border-bottom: 1px solid #f0f0f0; display: flex; align-items: flex-start; }
                        .info-item:last-child { border-bottom: none; }
                        .label { font-weight: 600; width: 120px; color: #64748b; flex-shrink: 0; }
                        .value { color: #1e293b; font-weight: 500; flex: 1; }
                        .contact-card { background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 20px; margin-top: 30px; text-align: center; }
                        .contact-text { margin-bottom: 15px; font-size: 16px; color: #c2410c; }
                        .btn-zalo { display: inline-block; background-color: #0068ff; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(0, 104, 255, 0.2); transition: transform 0.2s; }
                        .btn-zalo:hover { transform: translateY(-2px); box-shadow: 0 6px 8px rgba(0, 104, 255, 0.3); }
                        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🛠️ ĐẶT LỊCH SỬA CHỮA MỚI</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Khách hàng vừa đặt lịch sửa chữa laptop</p>
                        </div>
                        
                        <div class="content">
                            <div class="info-group">
                                <div class="info-item">
                                    <span class="label">👤 Khách hàng:</span>
                                    <span class="value" style="font-size: 16px; color: #0f172a;">${name}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">💻 Máy:</span>
                                    <span class="value">${model}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">🔧 Vấn đề:</span>
                                    <span class="value" style="color: #ef4444; font-weight: bold;">${issue}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">📝 Ghi chú:</span>
                                    <span class="value">${notes || 'Không có'}</span>
                                </div>
                            </div>

                            <div class="contact-card">
                                <p class="contact-text">📞 Số điện thoại / Zalo: <strong>${contact}</strong></p>
                                <a href="https://zalo.me/${contact.replace(/[^0-9]/g, '')}" class="btn-zalo">
                                    Chat Zalo Ngay
                                </a>
                            </div>
                        </div>

                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} LapLap Cần Thơ - Hệ thống quản lý sửa chữa.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
        } else if (type === 'cleaning') {
            const name = data.name || data.customerName || 'Khách hàng';
            const contact = data.contact || data.customerPhone || 'Không có sđt';
            const model = data.model || data.productModel || (data.productInfo ? `${data.productInfo.brand} ${data.productInfo.model}` : 'Máy');
            const issue = data.issue || data.issueDescription || 'Vệ sinh định kỳ';
            const notes = data.notes || '';
            subject = `✨ ĐẶT LỊCH VỆ SINH: ${model || 'Khách'} - ${contact}`;
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
                        .content { padding: 30px; }
                        .info-group { margin-bottom: 20px; }
                        .info-item { padding: 12px 0; border-bottom: 1px solid #f0f0f0; display: flex; align-items: flex-start; }
                        .info-item:last-child { border-bottom: none; }
                        .label { font-weight: 600; width: 120px; color: #64748b; flex-shrink: 0; }
                        .value { color: #1e293b; font-weight: 500; flex: 1; }
                        .contact-card { background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; padding: 20px; margin-top: 30px; text-align: center; }
                        .contact-text { margin-bottom: 15px; font-size: 16px; color: #047857; }
                        .btn-zalo { display: inline-block; background-color: #0068ff; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(0, 104, 255, 0.2); transition: transform 0.2s; }
                        .btn-zalo:hover { transform: translateY(-2px); box-shadow: 0 6px 8px rgba(0, 104, 255, 0.3); }
                        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✨ ĐẶT LỊCH VỆ SINH LAPTOP</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Khách hàng vừa đặt lịch vệ sinh bảo dưỡng</p>
                        </div>
                        
                        <div class="content">
                            <div class="info-group">
                                <div class="info-item">
                                    <span class="label">👤 Khách hàng:</span>
                                    <span class="value" style="font-size: 16px; color: #0f172a;">${name}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">💻 Máy:</span>
                                    <span class="value">${model}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">⚠️ Vấn đề:</span>
                                    <span class="value">${issue || 'Vệ sinh định kỳ'}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">📝 Ghi chú:</span>
                                    <span class="value">${notes || 'Không có'}</span>
                                </div>
                            </div>

                            <div class="contact-card">
                                <p class="contact-text">📞 Số điện thoại / Zalo: <strong>${contact}</strong></p>
                                <a href="https://zalo.me/${contact.replace(/[^0-9]/g, '')}" class="btn-zalo">
                                    Chat Zalo Ngay
                                </a>
                            </div>
                        </div>

                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} LapLap Cần Thơ - Dịch vụ vệ sinh laptop.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
        } else {
            // Default to 'trade-in'
            const { model, cpu, ram, ssd, gpu, battery, condition, notes, contact } = data;
            subject = `🔔 YÊU CẦU ĐỊNH GIÁ: ${model}`;
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                        .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
                        .content { padding: 30px; }
                        .info-group { margin-bottom: 20px; }
                        .info-item { padding: 12px 0; border-bottom: 1px solid #f0f0f0; display: flex; align-items: flex-start; }
                        .info-item:last-child { border-bottom: none; }
                        .label { font-weight: 600; width: 120px; color: #64748b; flex-shrink: 0; }
                        .value { color: #1e293b; font-weight: 500; flex: 1; }
                        .contact-card { background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 20px; margin-top: 30px; text-align: center; }
                        .contact-text { margin-bottom: 15px; font-size: 16px; color: #1e40af; }
                        .btn-zalo { display: inline-block; background-color: #0068ff; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(0, 104, 255, 0.2); transition: transform 0.2s; }
                        .btn-zalo:hover { transform: translateY(-2px); box-shadow: 0 6px 8px rgba(0, 104, 255, 0.3); }
                        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔔 YÊU CẦU ĐỊNH GIÁ MỚI</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Khách hàng vừa gửi thông tin máy cần bán</p>
                        </div>
                        
                        <div class="content">
                            <div class="info-group">
                                <div class="info-item">
                                    <span class="label">💻 Tên máy:</span>
                                    <span class="value" style="font-size: 16px; color: #0f172a;">${model}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">⚙️ Cấu hình:</span>
                                    <span class="value">${cpu} | ${ram} | ${ssd} | ${gpu || 'Onboard'}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">🔋 Pin & Màn:</span>
                                    <span class="value">${battery}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">✨ Tình trạng:</span>
                                    <span class="value">
                                        <span style="background: ${condition === '99' ? '#dcfce7' : condition === '90' ? '#fee2e2' : '#fef9c3'}; color: ${condition === '99' ? '#166534' : condition === '90' ? '#991b1b' : '#854d0e'}; padding: 4px 10px; border-radius: 99px; font-size: 13px; font-weight: bold;">
                                            ${condition}%
                                        </span>
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="label">📝 Ghi chú:</span>
                                    <span class="value">${notes || 'Không có'}</span>
                                </div>
                            </div>

                            <div class="contact-card">
                                <p class="contact-text">📞 Số điện thoại / Zalo: <strong>${contact}</strong></p>
                                <a href="https://zalo.me/${contact.replace(/[^0-9]/g, '')}" class="btn-zalo">
                                    Chat Zalo Ngay
                                </a>
                            </div>
                        </div>

                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} LapLap Cần Thơ - Hệ thống quản lý thu cũ đổi mới.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'laplapcantho@gmail.com',
            subject: subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
    }
}
