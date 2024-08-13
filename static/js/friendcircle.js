function initialize_fc_lite(){const root=document.getElementById('friend-circle-lite-root');if(!root)return;root.innerHTML='';const randomArticleContainer=document.createElement('div');randomArticleContainer.id='random-article';root.appendChild(randomArticleContainer);const container=document.createElement('div');container.className='articles-container';container.id='articles-container';root.appendChild(container);const loadMoreBtn=document.createElement('button');loadMoreBtn.id='load-more-btn';loadMoreBtn.innerText='显示更多';root.appendChild(loadMoreBtn);const statsContainer=document.createElement('div');statsContainer.id='stats-container';root.appendChild(statsContainer);let start=0;let allArticles=[];function loadMoreArticles(){const cacheKey='friend-circle-lite-cache';const cacheTimeKey='friend-circle-lite-cache-time';const cacheTime=localStorage.getItem(cacheTimeKey);const now=new Date().getTime();if(cacheTime&&(now-cacheTime<10*60*1000)){const cachedData=JSON.parse(localStorage.getItem(cacheKey));if(cachedData){processArticles(cachedData);return}}fetch(`${UserConfig.private_api_url}all.json`).then(response=>response.json()).then(data=>{localStorage.setItem(cacheKey,JSON.stringify(data));localStorage.setItem(cacheTimeKey,now.toString());processArticles(data)}).finally(()=>{loadMoreBtn.innerText='显示更多'})}function processArticles(data){allArticles=data.article_data;const stats=data.statistical_data;statsContainer.innerHTML=`<div>订阅:${stats.friends_num}活跃:${stats.active_num}总文章数:${stats.article_num}<br></div><div>更新时间:${stats.last_updated_time}</div>`;const randomArticle=allArticles[Math.floor(Math.random()*allArticles.length)];randomArticleContainer.innerHTML=`<div class="random-container"><div class="random-container-title">🎉The Lucky One</div><div class="random-title">${randomArticle.title}</div><div class="random-author">作者:${randomArticle.author}</div></div><button class="random-link-button"onclick="window.open('${randomArticle.link}', '_blank')">过去转转</button>`;const articles=allArticles.slice(start,start+UserConfig.page_turning_number);articles.forEach(article=>{const card=document.createElement('div');card.className='card';const title=document.createElement('div');title.className='card-title';title.innerText=article.title;card.appendChild(title);title.onclick=()=>window.open(article.link,'_blank');const author=document.createElement('div');author.className='card-author';const authorImg=document.createElement('img');authorImg.className='no-lightbox';authorImg.src=article.avatar||UserConfig.error_img;authorImg.onerror=()=>authorImg.src=UserConfig.error_img;author.appendChild(authorImg);author.appendChild(document.createTextNode(article.author));card.appendChild(author);author.onclick=()=>{showAuthorArticles(article.author,article.avatar,article.link)};const date=document.createElement('div');date.className='card-date';date.innerText="🗓️"+article.created.substring(0,10);card.appendChild(date);const bgImg=document.createElement('img');bgImg.className='card-bg no-lightbox';bgImg.src=article.avatar||UserConfig.error_img;bgImg.onerror=()=>bgImg.src=UserConfig.error_img;card.appendChild(bgImg);container.appendChild(card)});start+=UserConfig.page_turning_number;if(start>=allArticles.length){loadMoreBtn.style.display='none'}}function showAuthorArticles(author,avatar,link){if(!document.getElementById('modal')){const modal=document.createElement('div');modal.id='modal';modal.className='modal';modal.innerHTML=`<div class="modal-content"><img id="modal-author-avatar"src=""alt=""><a id="modal-author-name-link"></a><div id="modal-articles-container"></div></div>`;document.body.appendChild(modal)}const modal=document.getElementById('modal');const modalArticlesContainer=document.getElementById('modal-articles-container');const modalAuthorAvatar=document.getElementById('modal-author-avatar');const modalAuthorNameLink=document.getElementById('modal-author-name-link');modalArticlesContainer.innerHTML='';modalAuthorAvatar.src=avatar||UserConfig.error_img;modalAuthorAvatar.onerror=()=>modalAuthorAvatar.src=UserConfig.error_img;modalAuthorNameLink.innerText=author;modalAuthorNameLink.href=new URL(link).origin;const authorArticles=allArticles.filter(article=>article.author===author);authorArticles.slice(0,5).forEach(article=>{const articleDiv=document.createElement('div');articleDiv.className='modal-article';const title=document.createElement('a');title.className='modal-article-title';title.innerText=article.title;title.href=article.link;title.target='_blank';articleDiv.appendChild(title);const date=document.createElement('div');date.className='modal-article-date';date.innerText="📅"+article.created.substring(0,10);articleDiv.appendChild(date);modalArticlesContainer.appendChild(articleDiv)});modal.style.display='block';setTimeout(()=>{modal.classList.add('modal-open')},10)}function hideModal(){const modal=document.getElementById('modal');modal.classList.remove('modal-open');modal.addEventListener('transitionend',()=>{modal.style.display='none';document.body.removeChild(modal)},{once:true})}loadMoreArticles();loadMoreBtn.addEventListener('click',loadMoreArticles);window.onclick=function(event){const modal=document.getElementById('modal');if(event.target===modal){hideModal()}}};document.addEventListener("DOMContentLoaded",function(){setTimeout(initialize_fc_lite,0)});document.addEventListener('pjax:complete',function(){setTimeout(initialize_fc_lite,0)});setTimeout(initialize_fc_lite,0);