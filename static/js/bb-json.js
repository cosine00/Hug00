var bbMemos = {
    memos: 'https://fc.hux.ink/memos.json', // 修改为你的 JSON 文件 URL
    limit: '5',
    domId: 'bber',
    twiEnv: 'https://twikoo.hux.ink/',
  };
  
  function loadJS(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if (typeof callback === 'function') {
      script.onload = callback;
    }
    document.head.appendChild(script);
  }
  
  function fetchMemoData() {
    var bbUrl = bbMemos.memos;
    var bbDom = document.getElementById(bbMemos.domId);
    var loading = document.querySelector('#bber-loading') || document.createElement('div');
    loading.id = 'bber-loading';
    loading.innerHTML = '加载中...';
    bbDom.appendChild(loading);
  
    fetch(bbUrl)
      .then(res => res.json())
      .then(resdata => {
        var result = resdata.slice(0, bbMemos.limit);
        bbDom.innerHTML = '';
        result.forEach(item => {
          var bbTime = new Date(item.created).toLocaleString('zh-cn', { hour12: false });
          var bbCont = item.content;
          var newbbCont = bbCont
            .replace(/!\[(.*?)\]\((.*?)\)/g, '')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
          var bbContDiv = document.createElement('div');
          bbContDiv.innerHTML = marked.parse(newbbCont);
  
          var bbImages = item.images || [];
          var imgHtml = '';
          if (bbImages.length > 0) {
            imgHtml = '<div class="resimg resimg-' + bbImages.length + '">';
            bbImages.forEach(img => {
              imgHtml += `<figure class="gallery-thumbnail"><img class="img thumbnail-image" src="${img}"/></figure>`;
            });
            imgHtml += '</div>';
          }
  
          var tags = item.tags ? `<p class="tags">${item.tags.map(tag => `<span class="tag-span">#${tag} </span>`).join('')}</p>` : '';
  
          var bbItem = `<li class="timeline-item">
            <div class="itemdiv">
              <div class="datatime">${bbTime}</div>
              <div class="datacont">
                ${bbContDiv.innerHTML}
                ${imgHtml}
                ${tags}
              </div>
              <p class="datafrom">来自:Memos</p>
            </div>
          </li>`;
          bbDom.insertAdjacentHTML('beforeend', bbItem);
        });
  
        window.ViewImage && ViewImage.init('.datacont img');
        window.Lately && Lately.init({ target: '.datatime' });
      })
      .catch(error => {
        console.error('Error:', error);
        loading.innerHTML = '加载失败，请稍后重试';
      });
  }
  
  // 加载必要的脚本
  loadJS('/js/marked.min.js', () => {
    loadJS('/js/view-image.min.js', () => {
      loadJS('/js/lately.min.js', () => {
        fetchMemoData();
      });
    });
  });
  
  // Twikoo 评论加载
  loadJS('/js/twikoo.all.min.js', () => {
    if (bbMemos.twiEnv) {
      twikoo.init({
        envId: bbMemos.twiEnv,
        el: '#tcomment',
        path: 'bbmemo',
      });
    }
  });