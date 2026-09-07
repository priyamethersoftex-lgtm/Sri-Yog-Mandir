import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/ui/PageContainer';
import { DataTable } from '../../components/ui/DataTable';
import { inquiryService, Inquiry } from '../../services/inquiryService';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
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

  const handleStatusUpdate = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'PENDING' ? 'CLOSED' : 'PENDING';
    try {
      await inquiryService.updateInquiryStatus(id, newStatus);
      toast.success(`Inquiry marked as ${newStatus}`);
      fetchInquiries(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
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
      cell: (item: Inquiry) => {
        const isClosed = item.status === 'CLOSED';
        return (
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
            isClosed 
              ? 'bg-semantic-success/10 text-semantic-success border-semantic-success/20' 
              : 'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20'
          }`}>
            {item.status}
          </span>
        );
      } 
    },
    { header: 'Date', cell: (item: Inquiry) => formatDate(item.created_at) },
    {
      header: 'Actions',
      cell: (item: Inquiry) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleStatusUpdate(item.id, item.status)}
          className={item.status === 'PENDING' ? 'text-text hover:text-semantic-success border-border' : 'text-text-secondary hover:text-brand-600 border-border'}
        >
          {item.status === 'PENDING' ? 'Mark as Closed' : 'Reopen'}
        </Button>
      ),
      className: 'text-right'
    }
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
