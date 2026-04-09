import { Plus, FileText, Image, File, Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const documents = [
  { id: "1", name: "Project Requirements.pdf", type: "PDF", size: "2.4 MB", project: "Website Redesign", uploadedBy: "Alice M.", date: "Apr 07" },
  { id: "2", name: "UI Mockups.png", type: "Image", size: "5.1 MB", project: "Website Redesign", uploadedBy: "Bob K.", date: "Apr 06" },
  { id: "3", name: "API Documentation.docx", type: "DOCX", size: "1.2 MB", project: "CRM Integration", uploadedBy: "Carol S.", date: "Apr 05" },
  { id: "4", name: "Migration Plan.pdf", type: "PDF", size: "890 KB", project: "Data Migration", uploadedBy: "Dave L.", date: "Apr 04" },
  { id: "5", name: "Test Results.pdf", type: "PDF", size: "3.7 MB", project: "Mobile App v2.0", uploadedBy: "Eve R.", date: "Apr 03" },
  { id: "6", name: "Architecture Diagram.png", type: "Image", size: "1.8 MB", project: "API Gateway", uploadedBy: "Grace H.", date: "Apr 02" },
];

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  Image: Image,
  DOCX: File,
};

const typeColors: Record<string, string> = {
  PDF: "bg-destructive/10 text-destructive",
  Image: "bg-info/10 text-info",
  DOCX: "bg-primary/10 text-primary",
};

const Documents = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Documents</h1>
          <p className="page-subtitle">{documents.length} files uploaded</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Upload File</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">File</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Project</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Size</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Uploaded By</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const TypeIcon = typeIcons[doc.type];
              return (
                <tr key={doc.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${typeColors[doc.type]}`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{doc.project}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{doc.size}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{doc.uploadedBy}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{doc.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors"><Download className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors"><Trash2 className="w-4 h-4 text-muted-foreground" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Documents;
