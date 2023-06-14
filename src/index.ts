import { Page } from "playwright";

const { chromium }  = require('playwright');
const fs  = require('fs');

const targetURL:string = "https://amazon.com";
const SEARCHITEM = 'iphone';
const LABEL = {
    searchInputLabel: 'Search Amazon',
}


var SELECTORS = {
    searchIcon:  'css=[value="Go"]',
    sortDropDown: '#a-autoid-0-announce',
    sortLessToHigh: 'css=[id="s-result-sort-select_1"]',
    itemName: '.s-title-instructions-style',
    itemPrice: 'div[data-component-type="s-search-result"] .a-price .a-offscreen',
    itemLink: '.s-product-image-container a',
    searchResultContainer: 'div[data-component-type="s-search-result"]'
}

async function extractPriceToCSV(): Promise<void>{
    const writeToCsv = async (data:any) => {
        try {
            fs.writeFile("./fileName.csv", data, () => {
                console.log('done');
            });
          } catch (err) {
            console.error(err);
          }
    }
    
    const extractData = async (page: Page): Promise<string> => {
        const mapFunction = (itemRows: HTMLElement[]) => {
            return itemRows.slice(0,3).map((itemRow: any) => {
                const itemName:string = itemRow.querySelector('.s-title-instructions-style')?.innerText?.split(',')[0];
                const itemPrice:string = itemRow.querySelector('div[data-component-type="s-search-result"] .a-price .a-offscreen')?.innerText;
                const itemLink:string = itemRow.querySelector('.s-product-image-container a')?.getAttribute('href');
                return `${itemName || ''},${itemPrice || ''},${itemLink || ''}`;
            }).join('\n'); 
        }
        const itemRowHandle = await page.$$eval('div[data-component-type="s-search-result"]', mapFunction);
        return 'ItemName,ItemPrice,ItemLink' + '\n' + itemRowHandle;
    }
    
        const browser = await chromium.launch({
            headless: false
        });
        const page = await browser.newPage();
        await page.goto(targetURL);

        const serachBar = await page.getByLabel(LABEL.searchInputLabel);
        serachBar.fill(SEARCHITEM);
        const searchButton= await page.locator(SELECTORS.searchIcon);
        await searchButton.click();
        await page.waitForLoadState('domcontentloaded');

        const drop = await page.locator(SELECTORS.sortDropDown);
        await drop.click();
        await  page.waitForSelector(SELECTORS.sortLessToHigh)
        
        const sortBy = page.locator(SELECTORS.sortLessToHigh);
        await sortBy.click();
        await page.waitForTimeout(5000);
        
        const data = await extractData(page);
        await writeToCsv(data);
        await browser.close();
};



extractPriceToCSV();

