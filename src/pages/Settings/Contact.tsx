import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { DataTable } from '../../components/ui/DataTable';
import { inquiryService, Inquiry } from '../../services/inquiryService';
import { toast } from 'sonner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils/dateformatUtils';

export default function Contact() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchInquiries();
  }, [page]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await inquiryService.getInquiries(page, pageSize);
      setInquiries(response.list);
      setTotalRecords(response.pagination.total);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Name',
      cell: (item: Inquiry) => (
        <div>
          <div className="font-bold text-sm">{item.name}</div>
          <div className="text-xs text-text-muted mt-0.5">{item.email}</div>
        </div>
      )
    },
    { header: 'Subject', accessorKey: 'subject' as keyof Inquiry },
    { 
      header: 'Status', 
      cell: (item: Inquiry) => (
        <span className="px-2.5 py-1 bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/20 rounded-lg text-xs font-bold">
          {item.status}
        </span>
      ) 
    },
    { header: 'Date', cell: (item: Inquiry) => formatDate(item.created_at) }
  ];

  return (
    <PageContainer
      title="Contact Enquiries"
      description="View contact inquiries from users."
    >
      <DataTable
        data={inquiries}
        columns={columns}
        keyExtractor={(item) => String(item.id)}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPage}
      />
    </PageContainer>
  );
}
