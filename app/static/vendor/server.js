const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = 7070;

// Use CORS middleware
app.use(cors());

app.use(express.static('public'));

app.get('/generate-pdf', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Replace with the path to your HTML file or URL
    await page.goto('http://localhost:7070', { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});