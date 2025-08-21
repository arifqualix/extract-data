import fitz  # PyMuPDF
import json

# Path to your PDF file
pdf_path = "Midas_Clothing_Catalog_25_26.pdf"

# List of product names you provided
product_names = [
    "8020 SHORTS", "Advance Tech Jacket", "ANGOLA TROUSERS", "ARDOR ADVANCE TECH JACKET",
    "AUTO-PORTANT FEMALE COVERALL", "Bennu Coverall", "BINARY CONVERTIBLE PANTS",
    "BLUEDEN JACKET", "BRISKLY RIDER JACKET", "CHAINSAW BIB PANTS",
    "Classic Bib Canvas overall", "CLASSIC SERVICES PANTS", "CLASSIC TROUSER",
    "Combi suit", "Cover cargo trouser", "Cut Resistant-Grey", "CUT RESISTANT-SWEATSHIRT",
    "DENIM WORK PANTS", "DURA SOFTSHELL JACKET", "Dura softshell Trouser",
    "Dura tough-Industrial trouser", "DURO 2TONE INDUSTRIAL PANT", "DWR FLEXI FORCE JACKET",
    "ECO BLUE SCRUBS", "ECO-BLUE SCRUBS SET", "ECO-Fleece work jacket",
    "ECO-TERRAIN WORK Pants", "EnviroArmor pants", "Excel FR Coverall", "Filan trouser",
    "FR ANTISTATIC BALACLAVA-GREY WHI", "FR BALACLAVA-BLACK", "FR Blaze Guard Coverall",
    "FR Cargo pants", "FR Contrasting pants (img + 3D)", "FR Denim jacket",
    "FR Female Hybrid shirt", "FR GUARD PANTS", "FR Lit armor vest", "FR Mihawk Jacket",
    "FR Pro-Weather shield Parka", "FR Reflective-Cargo Pants", "FR TERRA overlay shirt",
    "FREEZER WEAR COVERALL", "FRIEDEN SCRUBS SET", "GUARD ZTONE STRETCH JACKET",
    "Hardshell Hybrid jacket", "Heat sensing-EmviroArmor Jacket", "High Vis Benoni Jacket",
    "High Vis Tormund Jacket", "High Vis Windbreaker Jacket", "HI-VIS ZTONE POLO",
    "HI-VIS BREAKEVEN MESH VEST", "Hi-Vis Fleece jacket", "HI-VIS FREEZER WEAR JACKET",
    "Hi-vis Illuminer Tech Jacket", "Hi-Vis Industrial Trouser", "Hi-VIS RAIN PARKA",
    "Hi-Vis Reversible Jacket", "Hi-Vis Safety Vest (img + 3D)", "Hi-VIS SERVICES SWEATSHIRT",
    "Hi-Vis Trouser (img + 3D)", "Hi-VIS Weather-Guard jacket", "Hi-VISIBILITY FREEZER OVERALLS",
    "Hunting Vest", "Hybrid Denim jacket", "INCOMBUSTIBLE ALPHA coverall", "INGRESS COVERALL",
    "Inherint Coverall", "KEWL PHASE CHANGE VEST", "Lumen Hi-Vis Jacket",
    "Lumia Reflective cargo pants", "Maven Utility cargo pants", "MESH HI-VIS VEST",
    "MILITARY FIELD JACKET", "Move HI-VIS SHORTS", "MOVE SOFTSHELL JACKET", "Nami Fleece jacket",
    "NORD JACKET", "NORD RECYCLED TEDDY FLEECE JACKET", "NOVA RECYCLED FLEECE JACKET",
    "Nyco Industrial Jacket", "NYCO TOUGH-INDUSTRIAL COVERALL", "NYCO TOUGH-INDUSTRIAL JACKET",
    "Nylon work jacket", "Performer Utility Jacket", "PRO-Advanced weather shield jacket",
    "Reddy Active light jacket", "REFLECTIVE GUARD JACKET", "REVERSIBLE QUILTED PARKA",
    "Row 91 Athena Hivis jacket", "RUHE SCRUBS SET", "SERGE ZTONE INDUSTRIAL PANTS",
    "Silvanus trouser", "Softshell Weather shield jacket", "SPECTRO JACKET",
    "Stalwart Windbreaker jacket", "Super Besten convertible pants", "SUSTAINABLE WORK JACKET",
    "Sustainable-Fleece work trouser", "Tencel Cargo Pants", "Terra Overlay shirt",
    "Titan Work Pants", "Toil Softshell Anorak", "Toil Workwear Cargo Pants",
    "TORMUND2 ADVANCE TECH", "Two tone Female coverall", "VANTGUARD POLO SHIRT",
    "VENTX SAFETY WINDBREAKER", "WEATHERPROOF MAVERICK JACKET", "Work Utility Pants"
]

# Load PDF
doc = fitz.open(pdf_path)

# Extract full text
pdf_text = ""
for page in doc:
    print(f"📄 Extracting text from page {page.number + 1}...")
    pdf_text += page.get_text("text") + "\n"

# Function to extract product details
def extract_product_details(product_name, start_id):
    idx = pdf_text.find(product_name)
    # print(f"🔍 Searching for '{product_name}' in PDF..."    )
    if idx == -1:
        return {
            "id": start_id,
            "name": product_name,
            "description": "",
            "features": [],
            "fabrics": []
        }
    chunk = pdf_text[idx: idx + 4000]  # capture larger block of text

    description, features, fabrics = "", [], []
    lines, capture = chunk.splitlines(), None

    for line in lines:
        l = line.strip()
        if not l:
            continue
        lower = l.lower()
        if lower.startswith("description"):
            capture = "desc"; continue
        if lower.startswith("features"):
            capture = "features"; continue
        if lower.startswith("fabric"):
            capture = "fabrics"; continue

        if capture == "desc":
            if lower.startswith(("features", "fabric")):
                capture = None
            else:
                description += " " + l
                # print(f"📖 Captured description for '{product_name}': {l[:50]}...")  # log first 50 chars
        elif capture == "features":
            if lower.startswith("fabric"):
                capture = None
            else:
                features.append(l)
        elif capture == "fabrics":
            if lower.startswith(("features", "description")):
                capture = None
            else:
                fabrics.append(l)

    return {
        "id": start_id,
        "name": product_name,
        "description": description.strip(),
        "features": features,
        "fabrics": fabrics
    }

# Build dataset
products = []
start_id = 10  # continue after your existing 9
for i, pname in enumerate(product_names):
    products.append(extract_product_details(pname, start_id + i))

# Save to JSON
with open("midas_products_full.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4)

print(f"✅ Extracted {len(products)} products → saved as midas_products_full.json")
