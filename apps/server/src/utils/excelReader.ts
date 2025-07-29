import { readFileSync } from "fs";
// import { read } from "xlsx/xlsx.mjs";
import * as XLSX from "xlsx";
import { prisma } from "@repo/database";
import path from "path";
const filePath = path.resolve(__dirname, "./utils/projects.xlsx");

readExcelFile(filePath)
  .then((data) => {
    // console.log(data);
    console.log("***:");
  })
  .catch((err) => {
    console.error("Error reading Excel file:", err);
  });
export async function readExcelFile(filePath: string): Promise<any[]> {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error("No sheets found in the workbook");
    }
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new Error("No worksheet found in the workbook");
    }
    // console.log("Reading Excel file:", filePath);
    // console.log("Sheet name:", sheetName);
    // console.log("Worksheet data:", worksheet);
    // const firstColumn = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
    // const secondRowFirstColumn = worksheet["A2"];
    const dataToInset = [];
    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1, // Returns a 2D array instead of JSON objects
      blankrows: false, // Skips completely empty rows
    });

    // Count of non-empty rows
    const filledRowCount = rows.length;

    for (let i = 1; i <= filledRowCount; i++) {
      const row = rows[i];
      if (row && row.length > 0) {
        // Assuming the first column is the one you want to insert
        let currentData = {
          title: row[0],
          description: row[1],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        dataToInset.push(currentData);
      }
    }
    // const firstRowData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[1];
    // console.log("First row data:", firstRowData);
    console.log("Data to insert:", dataToInset[0]);
    const insertProjects = await prisma.fYPProjects.createMany({
      data: dataToInset,
    });
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
}
