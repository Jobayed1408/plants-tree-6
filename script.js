const buttons = document.querySelectorAll('.category-btn');

let cart = [];

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        // console.log(btn.innerText);
        buttons.forEach(all => all.classList.remove("bg-[#15803d]", "text-white"));

        btn.classList.add("bg-[#15803d]", "text-white");
        let category = btn.innerText;
        if (category.endsWith("s")) {
            category = category.slice(0, -1);
        }

        const filtered = plantsData.filter(tree => tree.category === category);
        displayTrees(filtered);
    })
})

const showSpinner = () => {
    document.getElementById("spinner").classList.remove('hidden'); 
}
const hideSpinner = () => {
    document.getElementById("spinner").classList.add('hidden'); 
}


const loadTrees = () => {
    showSpinner(); 
    fetch('https://openapi.programming-hero.com/api/plants')
        .then((res) => res.json())
        .then(json => {
            plantsData = json.plants;
            displayTrees(plantsData)
        });
        hideSpinner();
}

 
const detailsCard = async(id) => {
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    console.log(url);
    const res = await fetch(url);
    const details = await res.json();
    detailsPlant(details.plants); 
}

const detailsPlant = (plant) => {
    console.log(plant); 
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
        
        <div >
            <div class="card p-2 bg-base-100 shadow-sm">
                <figure class="">
                    <img src="${plant.image}"
                        alt="Shoes" class="rounded-xl w-full md:h-48 object-cover" />
                </figure>
                <div class="w-full p-5">
                    <h2 onclick="detailsCard(${plant.id})" class="card-title cursor-pointer">${plant.name}</h2>
                    <p class=" py-3">${plant.description}</p>
                    <div class=" flex justify-between items-center w-full card-actions">
                        <button
                            class="btn shadow-none border-none font-semibold rounded-3xl p-5 bg-[#DCFCE7] text-[#15803d]">${plant.category}</button>
                        <p class="font-semibold">৳${plant.price}</p>
                    </div>
                </div>
            </div>
            </div>

    `;
    document.getElementById('my_modal_5').showModal(); 
}


const displayTrees = plants => {
    const treesContainer = document.getElementById('tree-container');

    treesContainer.innerHTML = "";

    plants.forEach(tree => {
        const cards = document.createElement('div');

        cards.innerHTML = `
        
        <div class="grid-cols-1">
                        <div class="card p-2 bg-base-100 shadow-sm">
                            <figure class="">
                                <img src="${tree.image}"
                                    alt="Shoes" class="rounded-xl w-full md:h-48 object-cover" />
                            </figure>
                            <div class="w-full p-5">
                                <h2 onclick="detailsCard(${tree.id})" class="card-title cursor-pointer">${tree.name}</h2>
                                <p class=" py-3">${tree.description.slice(0, 100)}</p>
                                <div class=" flex justify-between items-center w-full card-actions">
                                    <button
                                        class="btn shadow-none border-none font-semibold rounded-3xl p-5 bg-[#DCFCE7] text-[#15803d]">${tree.category}</button>
                                    <p class="font-semibold">৳${tree.price}</p>
                                </div>
                                
                                <button onclick="addToCart(${tree.id})"
                                class="add-cart mt-3 btn shadow-none border-none font-semibold rounded-3xl p-5 bg-[#15803d] text-white">Add
                                to Cart</button>
                            </div>
                        </div>

                    </div>

        `;
    treesContainer.appendChild(cards);

    })
}

const addToCart = (id) => {

    let selected = null;
    for(let i =0 ; i< plantsData.length; i++){
        if(plantsData[i].id === id) {
            selected = plantsData[i];
            break;
        }
    }

    let exist = false;
    for(let i=0; i<cart.length; i++){
        if(cart[i].id === id ){
            cart[i].qty += 1;
            exist = true;
            break;
        }
    }

    if(exist === false){
        cart.push({...selected, qty : 1});
    }

    renderCart();
};

const renderCart = () => {
    const cartContainer = document.getElementById("cart-container"); 
    cartContainer.innerHTML = "";

    let total = 0;

        for (const item of cart){
        total += item.price * item.qty;

        const div = document.createElement("div");
        div.innerHTML = `
        <div class="flex justify-between items-center bg-[#f0fdf4] rounded-lg mt-5">
            <div class="p-3">
                <h1 class="text-[#1f2937] text-[20px]">${item.name}</h1>
                <h1 class="text-[#1f293750] text-[20px]">৳${item.price} X ${item.qty}</h1>
            </div>
            <h1 class="pr-3 ">
                <button onclick="removeFromCart(${item.id})" class=" pr-5 cursor-pointer ">
                    <i class="fas fa-times text-2xl text-red-500"></i>
                </button> 
            </h1>
        </div>
                                                                                                                        
                    `;
        cartContainer.appendChild(div);
    };
    const totalDiv = document.createElement("div");
    totalDiv.className = "flex justify-between items-center rounded-lg mt-5";
    totalDiv.innerHTML = `
        <div class="p-3">
            <h1 class="text-[#0d1116] text-[24px]">Total:</h1>
        </div>
        <h1 class="pr-5 text-xl">৳${total}</h1>
    `;
    if(cart.length === 0){
        // console.log(cart.length)
        totalDiv.innerHTML = '';
    }
    cartContainer.appendChild(totalDiv);
};

const removeFromCart = (id) => {
    let carts = [];
    for(let i = 0;i<cart.length; i++)
    {
        if(cart[i].id !== id){
            carts.push(cart[i]);
        }
    }
    cart = carts;
    // console.log(cart)
    renderCart(); 
};

loadTrees();
