const XLSX = require("xlsx");
const fs = require('fs');

const products =  require("./static-data.js").dummyProducts;
const segments =  require("./static-data.js").productSegments;
const specialsData =  require("./static-data.js").specials;
const compliancesData =  require("./static-data.js").compliances;

const basURLForContent =  require("./static-data.js").basURLForContent;





function addSegmentIds() {
    const workbook = XLSX.readFile("midas_products.xlsx");
const sheetName = workbook.SheetNames[0]; // first tab
const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);



// console.log("products", products)

// loop through the product and on each product
 const updatedProducts = products.map(product => {
    const  tags = product.tags || [];
    // find the product from the excel sheet
    const existInTheSheet = worksheet.find(el => el['Product name']?.toLowerCase() === product.name.toLowerCase())
    // when found, find the segment id from product segments, based on the category
    if(existInTheSheet) {
        const segmentName = existInTheSheet['Category']?.toLowerCase();
        const segmentFound = segments.find(el => el.name?.toLowerCase() === segmentName) 
        if(segmentFound) {
            tags.push(segmentFound.id);
        } 
    }

 return {
    ...product,
    tags
 }   
})   


console.log("updatedProducts", updatedProducts)

// when segment id is found, update the product with the segment id


// updatedProducts is your array of product objects
fs.writeFileSync('updated_products.json', JSON.stringify(updatedProducts, null, 2));
console.log('✅ updated_products.json has been created.');
}




function addSpecialsIds() {
    const workbook = XLSX.readFile("midas_products.xlsx");
const sheetName = workbook.SheetNames[0]; // first tab
const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);



// console.log("products", products)

// loop through the product and on each product
 const updatedProducts = products.map(product => {
    const  tags = product.tags || [];
    // find the product from the excel sheet
    const existInTheSheet = worksheet.find(el => el['Product name']?.toLowerCase() === product.name.toLowerCase())
    // when found, find the segment id from product segments, based on the category
    if(existInTheSheet) {
        const specials = existInTheSheet['Specials']?.split(",");
        if(specials.length) {
            specials.forEach(special => {
                 const specialFound = specialsData.find(el =>  el?.name?.toLowerCase() === special?.toLowerCase()?.trim()) 
        if(specialFound) {
            tags.push(specialFound.id);
        }
            })
        }
        
    }

 return {
    ...product,
    tags
 }   
})   


console.log("updatedProducts", updatedProducts)

// when segment id is found, update the product with the segment id


// updatedProducts is your array of product objects
fs.writeFileSync('updated_products.json', JSON.stringify(updatedProducts, null, 2));
console.log('✅ updated_products.json has been created.');
}




function addComplianceIds() {
    const workbook = XLSX.readFile("midas_products.xlsx");
const sheetName = workbook.SheetNames[0]; // first tab
const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);



// console.log("products", products)

// loop through the product and on each product
 const updatedProducts = products.map(product => {
    const  tags = product.tags || [];
    // find the product from the excel sheet
    const existInTheSheet = worksheet.find(el => el['Product name']?.toLowerCase() === product.name.toLowerCase())
    // when found, find the segment id from product segments, based on the category
    if(existInTheSheet) {
        const compliances = existInTheSheet['Compliance']?.split("\r\n");
        if(compliances.length) {
            compliances.forEach(special => {
                 const complianceFound = compliancesData.find(el =>  el?.name?.toLowerCase() === special?.toLowerCase()?.trim()) 
        if(complianceFound) {
            tags.push(complianceFound.id);
        }
            })
        }
        
    }

 return {
    ...product,
    tags
 }   
})   


console.log("updatedProducts", updatedProducts)

// when segment id is found, update the product with the segment id


// updatedProducts is your array of product objects
fs.writeFileSync('updated_products.json', JSON.stringify(updatedProducts, null, 2));
console.log('✅ updated_products.json has been created.');
}


function setTheImagesURLs() {
    return products.map(product => {
            let images = product.images;
            if(!images) {
                const productIdNumber = product.id?.split("-")[1];
                 
                const segmentIdFound = product.tags.find(tag => tag.startsWith("segment-"))
                if(segmentIdFound && productIdNumber) {
                    const segmentIdNumber = segmentIdFound.split("-")[1];
                    if(segmentIdNumber) {
                        images = {
                            0:  [
                                `${basURLForContent}/images/segments/segment${segmentIdNumber}/product${productIdNumber}/image1.jpg`
                                `${basURLForContent}/images/segments/segment${segmentIdNumber}/product${productIdNumber}/image2.jpg`
                                `${basURLForContent}/images/segments/segment${segmentIdNumber}/product${productIdNumber}/image3.jpg`
                                `${basURLForContent}/images/segments/segment${segmentIdNumber}/product${productIdNumber}/image4.jpg`


                            ]
                        }

                    }
                }
            }




        

    })
}

addSegmentIds()
// addComplianceIds()


// const workbook = XLSX.readFile("midas_products.xlsx");
// const sheetName = workbook.SheetNames[0]; // first tab
// const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
// console.log("worksheet", worksheet)
// fs.writeFileSync('midas_products_excel_data.json', JSON.stringify(worksheet, null, 2));




// // addSpecialsIds()

// console.log(worksheet.slice(5, 20)); // preview first 5 rows



