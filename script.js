const XLSX = require("xlsx");
const fs = require('fs');

const products =  require("./static-data.js").dummyProducts;
const segments =  require("./static-data.js").productSegments;
const specialsData =  require("./static-data.js").specials;
const compliancesData =  require("./static-data.js").compliances;

const apparelTypesData =  require("./static-data.js").apparelTypes;


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
    const existInTheSheet = worksheet.find(el => {
        // console.log("el['Product name']", el['Product name'], "product.name", product.name)
        return el['Product name']?.toLowerCase()?.trim() === product.name.toLowerCase()
    })
    // when found, find the segment id from product segments, based on the category
    console.log("existInTheSheet", existInTheSheet, product.name)
    if(existInTheSheet) {
        console.log("existInTheSheet", existInTheSheet)
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


// console.log("updatedProducts", updatedProducts)

// when segment id is found, update the product with the segment id


// updatedProducts is your array of product objects
// fs.writeFileSync('updated_products.json', JSON.stringify(updatedProducts, null, 2));
// console.log('✅ updated_products.json has been created.');

addSpecialsIds(updatedProducts, worksheet)
}




function addSpecialsIds(products, worksheet) {
//     const workbook = XLSX.readFile("midas_products.xlsx");
// const sheetName = workbook.SheetNames[0]; // first tab
// const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);



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

addComplianceIds(updatedProducts, worksheet);
// updatedProducts is your array of product objects
// fs.writeFileSync('updated_products.json', JSON.stringify(updatedProducts, null, 2));
console.log('✅ updated_products.json has been created.');
}




function addComplianceIds(products, worksheet) {
//     const workbook = XLSX.readFile("midas_products.xlsx");
// const sheetName = workbook.SheetNames[0]; // first tab
// const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);



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
addApparelTypeIds(updatedProducts, worksheet);
// fs.writeFileSync('updated_products.json', JSON.stringify(updatedProducts, null, 2));
console.log('✅ updated_products.json has been created.');
}


function addApparelTypeIds(products, worksheet) {
//     const workbook = XLSX.readFile("midas_products.xlsx");
// const sheetName = workbook.SheetNames[0]; // first tab
// const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);



// console.log("products", products)

// loop through the product and on each product
 const updatedProducts = products.map(product => {
    const  tags = product.tags || [];
    // find the product from the excel sheet
    const existInTheSheet = worksheet.find(el => {
        // console.log("el['Product name']", el['Product name'], "product.name", product.name)
        return el['Product name']?.toLowerCase()?.trim() === product.name.toLowerCase()
    })
    // when found, find the segment id from product segments, based on the category
    console.log("existInTheSheet", existInTheSheet, product.name)
    if(existInTheSheet) {
        console.log("existInTheSheet", existInTheSheet)
        const apparelTypeName = existInTheSheet['Type of Apparel']?.toLowerCase()?.trim();
        const apparelTypeFound = apparelTypesData.find(el => el.name?.toLowerCase() === apparelTypeName) 
        
        if(apparelTypeFound) {
            tags.push(apparelTypeFound.id);
        } 
    }

 return {
    ...product,
    tags
 }   
})   


// console.log("updatedProducts", updatedProducts)

// when segment id is found, update the product with the segment id


// updatedProducts is your array of product objects
fs.writeFileSync('updated_products.json', JSON.stringify(updatedProducts, null, 2));
// console.log('✅ updated_products.json has been created.');
}







function setTheImagesURLs() {
        console.log("1");
    const updatedProducts = products.map(product => {
        console.log("2");
            
        let images = product.images;
        console.log("3");
           
        if(!images) {
        console.log("4");
         
            const productIdNumber = product.id?.split("-")[1];
        console.log("5");
        
            
                const segmentIdFound = product.tags.find(tag => tag.startsWith("segment-"))
        console.log("6");
      
                if(segmentIdFound && productIdNumber) {
        console.log("7");
     
                    const segmentIdNumber = segmentIdFound.split("-")[1];
                    
                    if(segmentIdNumber) {
        console.log("8", segmentIdNumber, productIdNumber, `https://raw.githubusercontent.com/Qualix-Solutions/MidasContent/refs/heads/main/images/segments/segment${segmentIdNumber}/product${productIdNumber}/image1.jpg`);
                        images = {
                            0:  [
                                `https://raw.githubusercontent.com/Qualix-Solutions/MidasContent/refs/heads/main/images/segments/segment${segmentIdNumber}/product${productIdNumber}/color1/image1.jpg`,
                                `https://raw.githubusercontent.com/Qualix-Solutions/MidasContent/refs/heads/main/images/segments/segment${segmentIdNumber}/product${productIdNumber}/color1/image2.jpg`,
                                `https://raw.githubusercontent.com/Qualix-Solutions/MidasContent/refs/heads/main/images/segments/segment${segmentIdNumber}/product${productIdNumber}/color1/image3.jpg`,
                                `https://raw.githubusercontent.com/Qualix-Solutions/MidasContent/refs/heads/main/images/segments/segment${segmentIdNumber}/product${productIdNumber}/color1/image4.jpg`,

                               
                            ]
                        }

                    }
                }
            }


    return {
        ...product,
        images

    }
        

    })
    console.log("updatedProducts", updatedProducts)

    fs.writeFileSync('updated_products_with_images.json', JSON.stringify(updatedProducts, null, 2));
}



function addLiveImageURL() {
    const updated = products.map(product => {
      const productIdNumber = product.id?.split("-")[1];
      const segmentIdFound = product.tags.find(tag => tag.startsWith("segment-"));
      const segmentIdNumber = segmentIdFound.split("-")[1];
    return {
      ...product,
      images: {
        0: [
          `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Fimage1.jpg?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,
          `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Fimage2.jpg?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,
          `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Fimage3.jpg?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,
          `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Fimage4.jpg?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,

        ]
      }
    }
  })

  
  console.log("updated", updated)
    fs.writeFileSync('updated_products_with_live_image_url.json', JSON.stringify(updated, null, 2));
    console.log('✅ updated_products_with_live_image_url.json has been created.');
}




function addModelImagesLiveURL() {
    const updated = products.map(product => {
      const productIdNumber = product.id?.split("-")[1];
      const segmentIdFound = product.tags.find(tag => tag.startsWith("segment-"));
      const segmentIdNumber = segmentIdFound.split("-")[1];
    return {
      ...product,
      modelImages: product.modelImages?.[0] ? {
        0:  {
        
        front: {
          default:
             `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Ffront.png?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,
            logoPlacement: null,
        },
        right: {
          logoPlacement: null,
          default:
                        `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Fright.png?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,
        },
        back: {
          logoPlacement: null,
          default:
             `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Fback.png?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,
        },
        rightAngle: {
          logoPlacement: null,
          default:
             `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Fright_angle.png?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,
        },
        leftAngle: {
          logoPlacement: null,
          default:
             `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Fleft_angle.png?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,
        },
        left: {
          logoPlacement: null,
          default:
             `https://firebasestorage.googleapis.com/v0/b/midas-189fa.firebasestorage.app/o/assets%2Fimages%2Fsegments%2Fsegment${segmentIdNumber}%2Fproduct${productIdNumber}%2Fcolor1%2Fleft.png?alt=media&token=ed1f661f-4a0b-4744-a7af-3fc3899f8957`,
        },
    
      },
      } : {}
    }
  })

  
  console.log("updated", updated)
    fs.writeFileSync('updated_products_with_live_image_url2.json', JSON.stringify(updated, null, 2));
    console.log('✅ updated_products_with_live_image_url.json has been created.');
}




addModelImagesLiveURL();

// addLiveImageURL();


// setTheImagesURLs();





// addSegmentIds()
// addComplianceIds()

// addApparelTypeIds()

// const workbook = XLSX.readFile("midas_products.xlsx");
// const sheetName = workbook.SheetNames[0]; // first tab
// const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
// console.log("worksheet", worksheet)
// fs.writeFileSync('midas_products_excel_data.json', JSON.stringify(worksheet, null, 2));




// // addSpecialsIds()

// console.log(worksheet.slice(5, 20)); // preview first 5 rows



