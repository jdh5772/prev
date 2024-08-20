const API_KEY = '487a4c46786d6f6f39336b6e4c6f51';
const $navItems = document.querySelectorAll('.nav-item');
const $select = document.getElementById('select');
const $searchInput = document.querySelector('.searchInput');
const $searchButton = document.querySelector('.searchBtn');
const $loading = document.querySelector('.loading');
const $cards = document.getElementById('cards');
const $hamBtn = document.querySelector('.ham');
const $modal = document.querySelector('.modal');
const $modalHam = document.querySelector('.modal-ham');
const $modalCategory = document.querySelector('.modal-category');

let currentPage = 1;
let totalDataNum = 0;
let currentCategory = ' ';
let pageSize = 9;
let groupSize = window.innerWidth <=900 ? 5 : 10;
let currentTitle = ' ';
let currentDate = ' ';
let resizing = false;

const showLoading = ()=>{
    $loading.style.display = 'block';
    $cards.style.display = 'none';
}

const hideLoading = ()=>{
    $loading.style.display = 'none';
    $cards.style.display = 'grid';
}

const createHtml = li=>{
    const title = li.TITLE.length>20 ? li.TITLE.slice(0,20)+' ...' : li.TITLE ;

    const html = `
    <li class="card">
          <div class="cardImg"><img src="${li['MAIN_IMG']}" alt="" /></div>
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
    $cards.innerHTML = html;
};


const fetchData = async (category=" ",title=" ",date=" ")=>{
    try{
        showLoading();
        const startIdx = pageSize*(currentPage-1)+1;
        const endIdx = pageSize*currentPage;
        let url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/${startIdx}/${endIdx}/${category}/${title}/${date}`;

        const res = await fetch(url);
        if(!res.ok){
            throw new Error('연결 실패');
        }
        const data = await res.json();
        
        if(data.culturalEventInfo && data.culturalEventInfo.RESULT.MESSAGE === '정상 처리되었습니다'){
            totalDataNum = data.culturalEventInfo['list_total_count'];
            const list = data.culturalEventInfo.row;
            renderList(list);
        } else{
            $cards.innerHTML = `
            <li>
            <p>데이터가 없습니다.</p>
            </li>
            `;
            totalDataNum = 0;
        }
        pagination();

    }
    catch(e){
        console.log(e); 
        $cards.innerHTML = `
        <li>
        <p>데이터를 불러오는데 실패했습니다.</p>
        </li>
        `;
    }
    finally{
        hideLoading();
    }
}

const movePage = pageNum=>{
    currentPage = pageNum;
    fetchData(currentCategory,currentTitle,currentDate);
}

const pagination = ()=>{
    const currentPageGroup = Math.ceil(currentPage/groupSize);
    const endPage = Math.ceil(totalDataNum/pageSize);
    const currentGroupFIrstPage = (currentPageGroup - 1) * groupSize + 1;
    const currentGroupLastPage = Math.min(endPage,currentPageGroup*groupSize);
    const prevGroupFirst = (currentPageGroup - 2) * groupSize +1;
    const nextGroupfirst = currentPageGroup * groupSize + 1;

    let html = `
    <button class="prevGroup" ${currentPageGroup===1 ? 'disabled' : ''} onClick="movePage(${prevGroupFirst})"><<</button>
    `;

    html+= `
    <button class="prevPage" ${currentPage===1 ? 'disabled' : ''} onClick="movePage(${currentPage-1})"><</button>
    `;

    for(let i=currentGroupFIrstPage;i<=currentGroupLastPage;i++){
        html+=`
        <button class="${i===currentPage ? 'on' : ''}" onClick="movePage(${i})">${i}</button>
        `;
    }

    html+=`
    <button class="nextPage" ${currentPage>= endPage ? 'disabled' : ''} onClick="movePage(${currentPage+1})">></button>
    `;

    html+=`
    <button class="nextGroup" ${currentPageGroup * groupSize >= endPage ? 'disabled' : ''} onClick="movePage(${nextGroupfirst})">>></button>
    `

    document.querySelector('.pgCon').innerHTML = html;
}


const searchData = ()=>{
    currentPage = 1;
    const selectValue = $select.value;
    const inputValue = $searchInput.value;
    if(inputValue===''){
        return;
    }

    if(selectValue==='search-title'){
        currentTitle = inputValue;
        currentDate = ' ';
        fetchData(currentCategory,inputValue,' ');
    } else{
        currentDate = inputValue;
        currentTitle = ' ';
        const rgx = /^\d{4}-\d{2}-\d{2}$/;
        if(rgx.test(inputValue)){
            fetchData(currentCategory,' ',inputValue);
        } else{
            alert('2024-08-12 형식으로 입력하세요!');
            $searchInput.value = '';
        }
    }
}

const handleItemClick = e=>{
    e.preventDefault();
    const category = e.currentTarget.dataset.category;
    const onLink = document.querySelector('.gnb .on');
    if(onLink){
        onLink.classList.remove('on');
    }
    e.currentTarget.classList.add('on');
    currentCategory = category;
    currentTitle = ' ';
    currentDate = ' ';
    currentPage = 1;
    $searchInput.value = '';
    fetchData(currentCategory);
}

const handleSelectChange = e => {
    if(e.currentTarget.value==='search-title'){
        $searchInput.setAttribute('placeholder','공연/행사명 입력');
    } else{
        $searchInput.setAttribute('placeholder','날짜 입력 ex)2024-08-12');
    }
}


const handleWindowResize = ()=>{
    const resizeGroupSize = window.innerWidth <=900 ? 5 : 10;
    if(resizeGroupSize !== groupSize){
        groupSize = resizeGroupSize;
        pagination();
    }

}

const toggleModal = boolean=>{
    $modal.classList.toggle('on',boolean);
}

const clickModalCategory = e=>{
    currentCategory = e.target.dataset.category;
    currentTitle = ' ';
    currentDate = ' ';
    toggleModal(false);
    fetchData(currentCategory,' ',' ');
    pagination();
}



$navItems.forEach(item=>{
    item.addEventListener('click',e=>{
        handleItemClick(e);
    })
});

$select.addEventListener('change',handleSelectChange);

$searchButton.addEventListener('click',searchData);
$searchInput.addEventListener('keyup',e=>{
    if(e.key==='Enter'){
        searchData();
    }
})

window.addEventListener('resize',handleWindowResize);

$hamBtn.addEventListener('click',()=>{
    toggleModal(true);
})

$modalHam.addEventListener('click',()=>{
    toggleModal(false);
})

$modalCategory.addEventListener('click',e=>clickModalCategory(e));

fetchData();