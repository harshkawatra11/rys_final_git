"""Browser regression checks. Run a local static server before this script.
Requires Playwright and an installed Chromium browser.
"""
import argparse,asyncio,json,sys,tempfile
from pathlib import Path
from playwright.async_api import async_playwright
parser=argparse.ArgumentParser(description='Check cold image loading, every carousel slide, and all portrait tabs.')
parser.add_argument('--base-url',default='http://localhost:8080')
parser.add_argument('--channel',default='msedge' if sys.platform=='win32' else None)
args=parser.parse_args()
out=Path(tempfile.gettempdir())/'rys-loading-debug';out.mkdir(exist_ok=True)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(channel=args.channel,headless=True)
  for mobile in [False,True]:
   c=await b.new_context(viewport={'width':390 if mobile else 1920,'height':844 if mobile else 1000},is_mobile=mobile)
   page=await c.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   delayed=[False]
   async def route(r):
    if any(x in r.request.url for x in ['googletagmanager.com','google-analytics.com','vercel-insights.com','/_vercel/','youtube.com/embed']) or r.request.resource_type=='media':await r.abort();return
    if 'mahila_yuva_samwad_2026-cover' in r.request.url and r.request.resource_type=='image' and not delayed[0]:
     delayed[0]=True;await asyncio.sleep(3)
    await r.continue_()
   await page.route('**/*',route)
   await page.goto(args.base_url.rstrip('/')+'/',wait_until='domcontentloaded')
   await page.evaluate("document.documentElement.style.scrollBehavior='auto'")
   await page.locator('.carousel-wrap').scroll_into_view_if_needed()
   await page.wait_for_function('document.querySelector(".carousel-slide img").complete && document.querySelector(".carousel-slide img").naturalWidth>0')
   await page.locator('#carouselDots [data-index="7"]').click()
   await page.wait_for_timeout(250)
   held=await page.locator('#carouselDots .active').get_attribute('data-index')
   assert held=='0',('should hold decoded current slide',held)
   await page.wait_for_function('document.querySelector("#carouselDots .active").dataset.index==="7"')
   print('Mobile' if mobile else 'Desktop','delayed-image test: kept old photo until new photo decoded.',flush=True)
   for i in range(12):
    await page.locator('#carouselDots [data-index="'+str(i)+'"]').click()
    await page.wait_for_function('(i)=>document.querySelector("#carouselDots .active").dataset.index===String(i)',arg=i)
    await page.wait_for_timeout(1100)
    data=await page.locator('.carousel-slide').nth(i).evaluate('e=>({loaded:e.querySelector("img").complete&&e.querySelector("img").naturalWidth>0,preview:getComputedStyle(e).backgroundImage!=="none",x:e.getBoundingClientRect().x,frame:e.closest(".carousel-wrap").getBoundingClientRect().x})')
    assert data['loaded'] and data['preview'] and abs(data['x']-data['frame'])<2,(i,data)
   print('All 12 carousel slides load and align correctly.',flush=True)
   await page.locator('#dignitaries').scroll_into_view_if_needed()
   tabs=page.locator('#dignitaries .dig-tab')
   for i in range(await tabs.count()):
    await tabs.nth(i).click()
    await page.wait_for_function('''()=>[...document.querySelectorAll('#dignitaries .dig-panel.active img')].every(i=>i.complete&&i.naturalWidth>0)''')
    images=await page.locator('#dignitaries .dig-panel.active img').evaluate_all('es=>es.map(i=>({src:i.currentSrc,preview:getComputedStyle(i.parentElement).backgroundImage!=="none"}))')
    expected='-480w.webp' if mobile else '-240w.webp'
    assert images and all(expected in im['src'] and im['preview'] for im in images),(i,images)
   print('All 6 dignitary tabs use correctly sized portraits with inline previews.',flush=True)
   await tabs.first.click()
   await page.locator('#dignitaries .dig-panel.active').scroll_into_view_if_needed()
   await page.wait_for_timeout(500)
   await page.screenshot(path=str(out/('fixed-portraits-'+('mobile' if mobile else 'desktop')+'.png')))
   assert not errors,errors
   await c.close()
  await b.close()
asyncio.run(main())
