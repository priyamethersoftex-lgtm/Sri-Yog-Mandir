import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {String} fileName - Name of the file (without extension)
 * @param {String} sheetName - Name of the sheet
 */
export const exportToExcel = (data: any[], fileName = 'export', sheetName = 'Data'): void => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
        console.error('Excel Export Error:', error);
    }
};

/**
 * Export data to Excel file with a main title header and auto-fit columns
 * @param {Array} data - Array of objects to export
 * @param {String} fileName - Name of the file (without extension)
 * @param {String} sheetName - Name of the sheet
 * @param {String} title - The main title to display at the top
 */
export const exportToExcelWithTitle = (data: any[], fileName = 'export', sheetName = 'Data', title = ''): void => {
    try {
        const wsData: any[][] = [
            [title],
            [] // Empty row for spacing
        ];

        const headers = data.length > 0 ? Object.keys(data[0]) : [];
        wsData.push(headers);

        data.forEach(item => {
            const row = headers.map(key => item[key]);
            wsData.push(row);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(wsData);

        // Merge cells for the title
        if (headers.length > 0) {
            worksheet['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }
            ];
        }

        // Auto-fit column widths
        const colWidths = headers.map(h => {
            let max = h.toString().length;
            data.forEach(item => {
                if (item[h] !== null && item[h] !== undefined) {
                    const len = item[h].toString().length;
                    if (len > max) max = len;
                }
            });
            return { wch: Math.min(max + 2, 50) }; // Add some padding, cap at 50
        });
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
        console.error('Excel Export Error:', error);
    }
};
