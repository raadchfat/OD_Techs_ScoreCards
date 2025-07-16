# Omaha Drain Techs KPI ScoreCard Dashboard

A React-based web dashboard that processes Excel files and displays weekly KPIs for Omaha Drain service technicians. The dashboard provides real-time data processing, filtering, and visualization capabilities.

## Features

- **Excel File Processing**: Upload and parse Opportunities Report and Line Items Sold Report Excel files
- **Real-time KPI Calculations**: Automatic calculation of 7 key performance indicators
- **Interactive Filtering**: Filter data by technician and week
- **Data Visualization**: Charts for revenue trends and job status distribution
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Drag & Drop Upload**: Easy file upload with drag-and-drop functionality

## KPIs Calculated

1. **Average Ticket Value** = Total Revenue / Won Jobs Count
2. **Job Close Rate** = Won Jobs / Total Jobs (excluding Invalid) × 100
3. **Weekly Revenue** = Sum of revenue from Won jobs
4. **Membership Win Rate** = Memberships Sold / Membership Opportunities × 100
5. **Hydro Jetting Jobs Sold** = Count jobs with line items containing "jetting" or "hydro"
6. **Descaling Jobs Sold** = Count jobs with line items containing "descal"
7. **Water Heater Jobs Sold** = Count jobs with categories/items containing "water heater"

## Tech Stack

- **React 19** with Hooks (useState, useEffect, useMemo)
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **SheetJS (xlsx)** for Excel file processing
- **Lodash** for data manipulation
- **Lucide React** for icons

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/raadchfat/OD_Techs_ScoreCards.git
cd OD_Techs_ScoreCards/omaha-drain-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### File Upload

1. **Prepare Excel Files**: Ensure you have two Excel files:
   - **Opportunities Report**: Contains columns for Date, Job (ID), Customer, Opportunity Owner, Status, Revenue, Membership Opportunity, Membership Sold
   - **Line Items Sold Report**: Contains columns for Job (ID), Opp. Owner, Category, Line Item, Price, Invoice Date

2. **Upload Files**: 
   - Drag and drop Excel files onto the upload area, or click "browse files"
   - The system will automatically detect file types based on filename
   - If detection fails, you'll be prompted to specify the file type

3. **Processing**: Files are automatically processed and merged based on Job ID

### Dashboard Features

- **Filtering**: Use the technician and week dropdowns to filter data
- **KPI Cards**: View all 7 KPIs in an organized grid layout
- **Charts**: 
  - Revenue trend line chart showing weekly performance
  - Job status distribution pie chart
- **Summary Stats**: Quick overview of total jobs, won jobs, and membership metrics

### Data Requirements

#### Opportunities Report Columns:
- Date
- Job (ID)
- Customer
- Opportunity Owner (technician)
- Status
- Revenue
- Membership Opportunity
- Membership Sold

#### Line Items Sold Report Columns:
- Job (ID)
- Opp. Owner (technician)
- Category
- Line Item
- Price
- Invoice Date

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── components/
│   ├── FileUpload.jsx      # File upload with drag & drop
│   ├── TechnicianFilter.jsx # Technician selection dropdown
│   ├── WeekFilter.jsx      # Week selection dropdown
│   ├── KPICard.jsx         # Individual KPI display card
│   ├── Dashboard.jsx       # Main dashboard layout
│   └── Charts/
│       ├── RevenueChart.jsx # Revenue trend line chart
│       └── JobStatusChart.jsx # Job status pie chart
├── hooks/
│   ├── useDataProcessor.js # Excel file processing logic
│   └── useKPICalculator.js # KPI calculations and filtering
└── utils/
    ├── excelParser.js      # Excel file parsing utilities
    ├── kpiCalculations.js  # KPI calculation functions
    └── dateUtils.js        # Date and week utilities
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to GitHub Pages

1. Add homepage to package.json:
```json
{
  "homepage": "https://raadchfat.github.io/OD_Techs_ScoreCards"
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add deploy scripts to package.json:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

## Troubleshooting

### Common Issues

1. **File Upload Errors**: Ensure Excel files have the correct column headers
2. **Processing Errors**: Check that both files are uploaded and contain valid data
3. **Display Issues**: Clear browser cache and refresh the page

### Data Validation

The system validates:
- Required columns are present in both files
- File formats are valid Excel files (.xlsx or .xls)
- Data is properly formatted and non-empty

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the GitHub repository.
