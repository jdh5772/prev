// const API_KEY = '';
const $navItems = document.querySelectorAll('.nav-item');
const $select = document.getElementById('select');
const $searchInput = document.querySelector('.searchInput');
const $searchButton = document.querySelector('.searchBtn');

let currentPage = 1;
let totalDataNum;
let currentCategory = ' ';
let pageSize = 9;
let groupSize = 10;

const createHtml = li=>{
    const img = li['MAIN_IMG'] || './img/no_image.png';
    const title = li.TITLE.length>20 ? li.TITLE.slice(0,20)+' ...' : li.TITLE ;

    const html = `
    <li class="card">
          <div class="cardImg"><img src="${img}" alt="" /></div>
          <p class="cardTitle">${title}</p>
          <p class="cardPlace">${li.PLACE}</p>
          <p class="cardDate">${li.STRTDATE.slice(0,10)} ~ ${li['END_DATE'].slice(0,10)}</p>
          <a href="${li['ORG_LINK']}" target="_blank"></a>
        </li>
    `;

    return html;
}

const renderList = list=>{
    const html = list.map(li=>createHtml(li)).join('');
    document.getElementById('cards').innerHTML = html;
};

const fetchData = async (category=" ",title=" ",date=" ")=>{
    try{
        const startIdx = currentPage*(currentPage-1)+1;
        const endIdx = currentPage*pageSize;
        let url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/${startIdx}/${endIdx}/${category}/${title}/${date}`;

        const res = await fetch(url);
        const data = await res.json();

        totalDataNum = data.culturalEventInfo['list_total_count'];
        const list = data.culturalEventInfo.row;
        renderList(list);
        pagination();
    }
    catch(e){
        console.log(e);
    }
}

const pagination = ()=>{
    const currentPageGroup = Math.ceil(currentPage/groupSize);
    const endPage = Math.ceil(totalDataNum/pageSize);
    const currentGroupFIrstPage = (currentPageGroup - 1) * groupSize + 1;
    const currentGroupLastPage = Math.min(endPage,currentPageGroup*groupSize);
    const prevGroupFirst = (currentPageGroup - 2) * groupSize +1;
    const nextGroupfirst = currentPageGroup * groupSize + 1;

    let html = `
    <button class="prevGroup" ${currentPageGroup===1 ? 'disabled' : ''}><<</button>
    `;

    html+= `
    <button class="prevPage" ${currentPageGroup===1 ? 'disabled' : ''}><</button>
    `;

    for(let i=currentGroupFIrstPage;i<=currentGroupLastPage;i++){
        html+=`
        <button class="${i===currentPageGroup ? 'on' : ''}">${i}</button>
        `;
    }

    html+=`
    <button class="nextPage" ${currentPage>= endPage ? 'disabled' : ''}>></button>
    `;

    html+=`
    <button class="nextGroup" ${currentPageGroup * groupSize >= endPage ? 'disabled' : ''}>>></button>
    `

    document.querySelector('.pgCon').innerHTML = html;
}

const searchData = ()=>{
    const selectValue = $select.value;
    const inputValue = $searchInput.value;
    if(selectValue==='search-title'){
        fetchData(' ',inputValue);
    } else{
        const rgx = /^\d{4}-\d{2}-\d{2}$/;
        if(rgx.test(inputValue)){
            fetchData(' ',' ',inputValue);
        } else{
            alert('9999-99-99 형식으로 입력하세요!');
        }
    }
    $searchInput.value = '';
}

const handleClick = e=>{
    const category = e.currentTarget.dataset.category;
    const onLink = document.querySelector('.gnb .on');
    if(onLink){
        onLink.classList.remove('on');
    }
    e.currentTarget.classList.add('on');
    currentCategory = category;
    fetchData(currentCategory);
}

$navItems.forEach(item=>{
    item.addEventListener('click',e=>{
        e.preventDefault();
        handleClick(e);
    })
});

$select.addEventListener('change',e=>{
    if(e.currentTarget.value==='search-title'){
        $searchInput.setAttribute('placeholder','공연 및 행사명을 입력하세요.');
    } else{
        $searchInput.setAttribute('placeholder','날짜를 입력하세요. ex)2024-08-12');
    }
})

$searchButton.addEventListener('click',searchData);
$searchInput.addEventListener('keyup',e=>{
    if(e.key==='Enter'){
        searchData();
    }
})

fetchData();