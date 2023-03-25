const puppeteer=require('uppeteer');

async function scrapeGithub Trending(){
    const browser=await puppeteer.launch();
    const page await browser.newPage();
    await page.goto("https://github.com/trending");

    const repositories=await page.$$('article.Box-row');
    const results=[];
    for(let repository of repositories){
        const title=await repository.$eval('h1>a',node=>node.innerText.trim());
        const description =await repository.$eval('p',node=>.innerText.trim());
        const language=await repository.$eval('span[itemprop="programmingLanguage"]',node=>node.innerText.trim());
        const stars=await repository.$eval('a[href$="/stargazers"]',node=>node.innerText.trim());
        const forks=await repository.$eval('a[href$="/network/members"]'.node=>node.innerText.trim());
        const url=await repository.$eval('h1>a',node=>node.href);

        results.push({title,description,language,stars,forks,url});
    }
    await page.click('ul.filter-list>li:nth-child(2)>a');
    await page.waitForSelector('ul.filter-list+div>div>article');

    comst developers=await page.$$('ul.filter-list+div>div>article');
    const devResults=[];

    for(let developer of developers){
        const name=await developer.$eval('h1>a',node=>node.innerText.trim());
        const username=await developer.$eval('h1>a',node=>node.href.split('/').pop());
        const repoName=await developer.$eval('h1+p>a',node=>node.innerText.trim());
        const repoDescripting=await developer.$eval('h1+p>a+span',node=>node.innerText.trim());
        devResults.push({name,username,repoName,repoDescription});
    }
    await browser.close();
    return{repositories: results,developers:devResults};
}
scrapeGithubTrending().then((results)=>{
    console.log(results);
    const fs=require('fs');
    fs.writeFile('github-trending.json',JSON.stringify(results),(err)=>{
        if(err)throw err;
        console.log('Results saved to github-trending.json');
    });
 }).catch((error)=>{
    console.error(error);
 });