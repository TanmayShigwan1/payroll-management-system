package com.payroll.system.service;

import com.payroll.system.model.PaySlip;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service for Excel operations - Export payroll data to Excel files
 */
@Service
public class ExcelService {

    /**
     * Export payslips to Excel format
     */
    public byte[] exportPaySlipsToExcel(List<PaySlip> paySlips) throws IOException {
        List<PaySlip> safePaySlips = paySlips != null ? paySlips : List.of();

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("PaySlips");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);

            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.setDataFormat(workbook.createDataFormat().getFormat("\u20B9#,##0.00"));

            CellStyle dateStyle = workbook.createCellStyle();
            dateStyle.setDataFormat(workbook.createDataFormat().getFormat("dd-mm-yyyy"));

            Row headerRow = sheet.createRow(0);
            String[] columns = {
                "PaySlip ID", "PaySlip Number", "Employee ID", "Employee Name", "Department",
                "Cost Center", "Issue Date", "Pay Period Start", "Pay Period End",
                "Gross Pay", "Income Tax", "Provident Fund", "ESI",
                "Professional Tax", "Health Insurance", "Retirement",
                "Total Deductions", "Net Pay", "Regular Hours", "Overtime Hours", "Status"
            };

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (PaySlip paySlip : safePaySlips) {
                if (paySlip == null || paySlip.getPayroll() == null) {
                    continue;
                }

                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(paySlip.getId() != null ? paySlip.getId() : 0);
                row.createCell(1).setCellValue(nonNull(paySlip.getPayslipNumber()));

                if (paySlip.getPayroll().getEmployee() != null &&
                        paySlip.getPayroll().getEmployee().getId() != null) {
                    row.createCell(2).setCellValue(paySlip.getPayroll().getEmployee().getId());
                }

                row.createCell(3).setCellValue(buildEmployeeName(paySlip));

                if (paySlip.getPayroll().getDepartment() != null) {
                    row.createCell(4).setCellValue(nonNull(paySlip.getPayroll().getDepartment().getName()));
                    row.createCell(5).setCellValue(nonNull(paySlip.getPayroll().getDepartment().getCostCenter()));
                } else {
                    row.createCell(4).setBlank();
                    row.createCell(5).setBlank();
                }

                writeDateCell(row, 6, paySlip.getIssueDate(), dateStyle);
                writeDateCell(row, 7, paySlip.getPayroll().getPayPeriodStart(), dateStyle);
                writeDateCell(row, 8, paySlip.getPayroll().getPayPeriodEnd(), dateStyle);

                writeCurrencyCell(row, 9, paySlip.getPayroll().getGrossPay(), currencyStyle);
                writeCurrencyCell(row, 10, paySlip.getPayroll().getIncomeTax(), currencyStyle);
                writeCurrencyCell(row, 11, paySlip.getPayroll().getProvidentFund(), currencyStyle);
                writeCurrencyCell(row, 12, paySlip.getPayroll().getEsi(), currencyStyle);
                writeCurrencyCell(row, 13, paySlip.getPayroll().getProfessionalTax(), currencyStyle);
                writeCurrencyCell(row, 14, paySlip.getPayroll().getHealthInsurance(), currencyStyle);
                writeCurrencyCell(row, 15, paySlip.getPayroll().getRetirementContribution(), currencyStyle);

                double totalDeductions = safeDouble(paySlip.getPayroll().getIncomeTax())
                        + safeDouble(paySlip.getPayroll().getProvidentFund())
                        + safeDouble(paySlip.getPayroll().getEsi())
                        + safeDouble(paySlip.getPayroll().getProfessionalTax())
                        + safeDouble(paySlip.getPayroll().getHealthInsurance())
                        + safeDouble(paySlip.getPayroll().getRetirementContribution());
                writeCurrencyCell(row, 16, totalDeductions, currencyStyle);

                writeCurrencyCell(row, 17, paySlip.getPayroll().getNetPay(), currencyStyle);
                writeNumericCell(row, 18, paySlip.getPayroll().getRegularHours());
                writeNumericCell(row, 19, paySlip.getPayroll().getOvertimeHours());
                row.createCell(20).setCellValue(nonNull(paySlip.getStatus(), "Generated"));
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private static void writeCurrencyCell(Row row, int columnIndex, Double value, CellStyle style) {
        if (value == null) {
            row.createCell(columnIndex).setBlank();
            return;
        }
        Cell cell = row.createCell(columnIndex);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private static void writeNumericCell(Row row, int columnIndex, Double value) {
        if (value == null) {
            row.createCell(columnIndex).setBlank();
            return;
        }
        row.createCell(columnIndex).setCellValue(value);
    }

    private static void writeDateCell(Row row, int columnIndex, java.time.LocalDate value, CellStyle style) {
        if (value == null) {
            row.createCell(columnIndex).setBlank();
            return;
        }
        Cell cell = row.createCell(columnIndex);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private static double safeDouble(Double value) {
        return value != null ? value : 0.0;
    }

    private static String nonNull(String value) {
        return nonNull(value, "");
    }

    private static String nonNull(String value, String defaultValue) {
        return value != null ? value : defaultValue;
    }

    private static String buildEmployeeName(PaySlip paySlip) {
        if (paySlip.getPayroll() == null || paySlip.getPayroll().getEmployee() == null) {
            return "";
        }
        String firstName = nonNull(paySlip.getPayroll().getEmployee().getFirstName());
        String lastName = nonNull(paySlip.getPayroll().getEmployee().getLastName());
        return (firstName + " " + lastName).trim();
    }
}