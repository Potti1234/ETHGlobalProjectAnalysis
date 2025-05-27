import asyncio
from playwright.async_api import async_playwright
import pandas as pd
from typing import List
import os # Added for os.path.exists

async def scrape_page(url: str, context) -> List[dict]:
    """Scrapes project data from a single page."""
    page_data = []
    print(f"Scraping page: {url}")
    page = await context.new_page()
    base_url = 'https://ethglobal.com'

    try:
        await page.goto(url, wait_until='networkidle', timeout=60000)
    except Exception as e:
        print(f"Timeout or error loading page {url}: {e}")
        await page.close()
        return page_data

    project_elements = await page.query_selector_all('a[href^="/showcase/"]:has(h2)')

    if not project_elements:
        print(f"No projects found on page {url}.")
        await page.close()
        return page_data

    print(f"Found {len(project_elements)} projects on page {url}")

    for el in project_elements:
        project = {}
        try:
            link_suffix = await el.get_attribute('href')
            project['link'] = f"{base_url}{link_suffix}" if link_suffix else 'N/A'

            name_element = await el.query_selector('h2.text-2xl')
            project['name'] = await name_element.inner_text() if name_element else 'N/A'

            desc_element = await el.query_selector('p.text-sm')
            project['description'] = await desc_element.inner_text() if desc_element else 'N/A'
            
            event_element = await el.query_selector('div[class*="bg-purple-300"]')
            if not event_element:
                event_element = await el.query_selector('div[class*="border-2 rounded-full"]')
            project['event'] = await event_element.inner_text() if event_element else 'N/A'

            prize_elements = await el.query_selector_all('span.inline-flex.items-center.-space-x-2 img[alt="prize"]')
            project['has_prize'] = len(prize_elements) > 0
            project['prize_count'] = len(prize_elements)
            
            page_data.append(project)
        except Exception as e:
            print(f"Error extracting data for an element on {url}: {e}")
            if 'name' not in project or not project.get('name'):
                project['name'] = "Error retrieving name"
            if project not in page_data: 
                 page_data.append(project)
    
    await page.close()
    return page_data

async def main(start_page_num: int = 1):
    all_projects_data_this_run = [] # Stores data collected in the current run for summary
    page_num = start_page_num
    base_showcase_url = 'https://ethglobal.com/showcase'
    csv_filename = 'data/data/ethglobal_projects.csv'
    
    print(f"Starting scrape from page: {start_page_num}")
    
    # Flag to manage header writing for the first page processed in this script execution.
    is_first_page_processed_this_run = True 

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
        
        while True:
            current_page_url = f"{base_showcase_url}?page={page_num}"
            projects_on_page = await scrape_page(current_page_url, context)
            
            if not projects_on_page:
                if page_num == start_page_num: # No data found even on the first attempted page
                    print(f"No projects found on the starting page {page_num}. Ending scrape.")
                else:
                    print(f"No more projects found on page {page_num}. Ending scrape.")
                break 
            
            all_projects_data_this_run.extend(projects_on_page)
            df_page = pd.DataFrame(projects_on_page)

            if is_first_page_processed_this_run:
                write_mode = 'w' if start_page_num == 1 else 'a'
                # Write header if mode is 'w', or if mode is 'a' and the file doesn't exist yet.
                should_write_header = (write_mode == 'w') or (write_mode == 'a' and not os.path.exists(csv_filename))
                
                df_page.to_csv(csv_filename, index=False, mode=write_mode, header=should_write_header)
                is_first_page_processed_this_run = False
            else:
                # Subsequent pages in this run, always append without header
                df_page.to_csv(csv_filename, index=False, mode='a', header=False)
            
            print(f"Saved data from page {page_num} to {csv_filename}")

            page_num += 1
            await asyncio.sleep(2) 
        
        await browser.close()

    if all_projects_data_this_run:
        pages_processed_count = page_num - start_page_num
        print(f"Scraped a total of {len(all_projects_data_this_run)} projects from {pages_processed_count} page(s) (from page {start_page_num} to {page_num -1}) and saved/appended to {csv_filename}")
    else:
        print("No data was scraped in this run.")

asyncio.run(main(start_page_num=1)) # You can change start_page_num here if needed