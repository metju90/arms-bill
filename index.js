const fs = require("fs");
const PDFParser = require("pdf-parse");
const path = require("path");

const directoryPath = "./arms-bills";
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  // Iterate over each file
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    // Perform operations on the file
    readPDF(filePath);
  });
});

function readPDF(pdfPath) {
  // Read the PDF file
  const dataBuffer = fs.readFileSync(pdfPath);
  let billData;
  // Parse the PDF data
  PDFParser(dataBuffer)
    .then(function (data) {
      // Extract the text content
      billData = data.text.split("\n").filter((d) => d);
    })
    .catch(function (error) {
      console.error(error);
    })
    .finally(function () {
      //   console.log(">>>", billData);
      //   process.exit();
      const dateTextLength = 11;
      const invoiceDigitsLength = 8;
      const elecReadingIndex =
        billData.findIndex((d) => d.includes("Cons. All Day")) + 1;
      const waterReadingIndex =
        billData.findIndex((d) => d.match(/^ Consumption$/)) + 1;

      const date = billData[0].substr(0, dateTextLength);
      const invoice = billData[0].substr(dateTextLength, invoiceDigitsLength);
      const elecConsumptionDate = billData
        .find((d) => d.search(/~Elettriku/) > -1)
        .split("(")[1]
        .replace(")", "");
      const waterConsumptionDate = billData
        .find((d) => d.search(/Ilma/) > -1)
        .split("(")[1]
        .replace(")", "");
      let elecCost, waterCost;
      try {
        [elecCost, waterCost] = billData
          .filter((d) => d.search(/Aġġustament/) > -1)
          .map((d) => d.split(" "));
        elecCost = elecCost[elecCost.length - 1];
        waterCost = waterCost[waterCost.length - 1];
      } catch (err) {
        [elecCost, waterCost] = billData
          .filter((d) => d.search(/Konsum \/ Consumption/) > -1)
          .map((d) => d.split(" ").filter((d) => d));

        elecCost = elecCost[elecCost.length - 1];
        waterCost = waterCost[waterCost.length - 1];
      }

      const elecReading = billData[elecReadingIndex].split(" ")[0];
      const waterReading = billData[waterReadingIndex].split(" ")[0];
      const addressIndex = billData.findIndex((d) => d.match(/Payable by/)) + 2;
      const apartment = billData[addressIndex];

      console.log({
        apartment,
        date,
        invoice,
        elecConsumptionDate,
        waterConsumptionDate,
        elecReading,
        waterReading,
        elecCost,
        waterCost,
      });
    });
}
