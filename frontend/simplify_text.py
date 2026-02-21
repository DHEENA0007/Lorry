import os
import glob

replacements = {
    "Transit Matrix": "Trips",
    "Trip Dispatch Console": "Trip Management",
    "Initiate Deployment": "Add New Trip",
    "Select Personnel Registry...": "Select Driver...",
    "Global Lookup:": "Search:",
    "Global Search...": "Search...",
    "Global search...": "Search...",
    "Asset Identity": "Vehicle No",
    "Personnel Registry": "Driver Directory",
    "Asset Designation": "Vehicle",
    "Target Hub": "Destination",
    "Origin City": "Source",
    "Route Budget": "Budget",
    "Master Pilot": "Driver",
    "Heavy Comm.": "Commercial",
    "Treasury Ops": "Finance",
    "Structured Finance": "Vehicle Finance",
    "Capital Servicing": "EMI Status",
    "Capital Deployed": "Total Paid",
    "Outstanding Liability": "Total Due",
    "Arrears Pending": "Overdue",
    "Corporate Fleet (All)": "All Vehicles",
    "Corporate Fleet": "Fleet",
    "Financial Institution": "Financier",
    "Lending Partner": "Financier",
    "Line Type": "Finance Type",
    "Principal Disbursed": "Loan Amount",
    "Mandate Value": "EMI Amount",
    "Term Horizon": "Duration",
    "Displaying Entity": "Showing",
    "Parameter Query Engine": "Search & Filter",
    "Configure Ledger View Criteria": "Filter options",
    "Contract Registry Database": "Finance Database",
    "Unassigned Personnel": "Unassigned",
    "Asset Class": "Vehicle",
    "Live Fleet Logistics": "Active Trips",
    "Awaiting Logistics Deployment": "No trips currently running",
    "Active deployments in transit": "Active trips running",
    "Origin Node": "Source",
    "Destination Node": "Destination",
    "Confirm Deployment": "Confirm Trip",
    "Deployment Date": "Trip Date",
    "fleet management system v2.0": "Fleet Management",
    "System Configuration": "Settings",
    "Security Configuration": "Security Settings",
    "User Access Control": "Roles & Permissions",
    "Operations Oversight": "Tracking",
    "Live Synchronization active": "Live Sync",
    "Global Logistics Nexus": "Tracking",
    "Logistics Nexus": "Tracking",
    "Refresh Registry": "Refresh",
    "Intelligence Center": "Analytics",
    "Active Driver": "Driver",
    "Assigned Vehicle": "Vehicle",
    "Active Trip Ledger": "Active Trips List",
    "Live Delivery Feed": "Current Trips",
    "Vehicle Status Overview": "Vehicle Status",
    "Operations Overview": "Operations Summary",
    "Extracted": "Entries",
    "Personnel": "Driver",
    "Designation RC Number": "RC Number",
    "Operational Class": "Vehicle Type",
    "Tire Configuration": "Tires",
    "Battery Capacity": "Batteries",
    "Trip Identity": "Trip ID",
    "Transit Route": "Route",
    "Fleet Assets": "Driver / Vehicle",
    "Freight Value": "Value",
    "Protocol": "Action",
    "Modify": "Edit"
}

import glob

for filename in glob.glob('/run/media/dheena/Leave you files/yoyotransport/frontend/src/**/*.jsx', recursive=True):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig_content = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != orig_content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")

print("Done")
