import { AuditLog } from "@/models/AuditLog";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth.config";

interface AuditData {
  collectionName: string;
  documentId: string;
  action: "create" | "update" | "delete";
  before?: any;
  after?: any;
  description?: string;
  req?: Request;
}

export async function logAudit(data: AuditData) {
  try {
    const auditData: any = {
      collectionName: data.collectionName,
      documentId: data.documentId,
      action: data.action,
      changes: {
        before: data.before || null,
        after: data.after || null,
      },
      description: data.description || "",
    };

    // Try to get user from session if req is provided
    if (data.req) {
      try {
        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
          auditData.userId = session.user.id;
        }
      } catch (e) {
        // Ignore session errors
      }
    }

    await AuditLog.create(auditData);
  } catch (error) {
    console.error("Audit log error:", error);
    // Don't throw - audit logging should not break main functionality
  }
}
