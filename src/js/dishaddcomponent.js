let DishAddComponent = {

    props: ['dataforcomponent',],
    data: function () {

        return {
            dish: {
                category: '',
                name :'',
                
                storage: ''
            },
            ingredients: "", // ALL 
            IngredientsInUse: [],
            CurRecept: {
                id: '',
                need: ''
            },
            modal : ""
        }
    },
    mounted: function () {

     
        this.ingredients = JSON.parse(JSON.stringify( this.dataforcomponent[0]))
  
        console.log('mounted Dish Edit Component')

        setTimeout(() => {   
            M.FormSelect.init(document.querySelectorAll('select'));
        }, 5);
this.modal = M.Modal.init(this.$el, {
    onCloseEnd:  ()=>{
       this.closeModal();
    }
})
this.modal.open();
    },
    watch : { receptSelect :() =>{

setTimeout(() => {
    
    M.FormSelect.init(document.querySelectorAll('select'));
}, 5);
    }}
    ,
    methods: {
        addRecept () {
            if(this.CurRecept.id=='' || this.CurRecept.need=="" || isNaN(Number(this.CurRecept.need)))
            {
                M.toast({
                    html: 'Вы что-то пропустили или ошиблись.'
                })
                return;
            }
            console.log( this.IngredientsInUse, 'DO IngredientsInUse')
            let finded = this.ingredients.find( el=>this.CurRecept.id ==el.id)
            finded.need = this.CurRecept.need;
            this.IngredientsInUse.push(finded);
            console.log(this.CurRecept, 'CUR RECEPT')
            console.log( this.IngredientsInUse, 'POSLE IngredientsInUse')
            this.CurRecept.id = '',
            this.CurRecept.need = '';

         
        },
        deleteRecept (id) {
            this.IngredientsInUse.splice(this.IngredientsInUse.findIndex((el) => {
                console.log('deleted',  el.id == id)
                return el.id == id;
            }), 1)
        },
        addtoserver() {

console.log(this.dish.IngredientsInUse, "INGREDIENT IN USE")

            if (!this.dish.img ||this.dish.name == '' || !this.dish.category || !this.dish.storage || isNaN(Number(this.dish.storage)) || this.IngredientsInUse.length == 0) {
                M.toast({
                    html: 'Вы что-то пропустили или ошиблись.'
                })
                return;
            }else{
                console.log( this.IngredientsInUse)
            
    this.dish.ingredients = '';
    this.IngredientsInUse.forEach((element,idx,arr) => {
    this.dish.ingredients += element.id + "+" + element.need 
    if(idx != arr.length-1) this.dish.ingredients += 'ENDING'
});

            this.dish.type='dish';
            this.$emit('addtoserver', this.dish)
}
        },
        closeModal () {
            this.modal.close()
            this.modal.destroy()
            this.$emit('destroycomponent')
        },
        getImgFromModal(ev) {

this.dish.img = ev.target.files[0];
}


        
    },
    computed: {
        receptSelect: function (params) {
           if(!this.ingredients)return 
            return this.ingredients.filter(el => {
                return ((!this.IngredientsInUse.find(elu=>elu.id == el.id)))
            })
        }
    },

    template: `
    <div id="editModal" class="modal">


    <div class="modal-content row">
      <div class="col s12">
        <h4>Добавление Блюда</h4>

        <input type="text"class="input-field" v-model="dish.name" placeholder="Имя">
 

        <input type="text" class="input-field" v-model="dish.storage" placeholder="Остаток"> 
        <input type="text" v-model="dish.category" placeholder="Категория">
<div class="row">
<div class="col s8">
 <select  v-model="CurRecept.id">
   <option  value="">Ингредиент</option>
   <option :value="recept.id" v-for="recept in receptSelect" :key="recept.id" v-bind:data-icon="recept.imgSrc">{{recept.name}}</option>
 </select>
</div>
<div class="col s4">
 <input type="text" placeholder="Количество" v-model="CurRecept.need">
</div>
</div>

<ul>
<span>Рецепт:</span>
<li v-for="recept in IngredientsInUse" :key="recept.id">
  {{recept.name}} - {{recept.need}}{{recept.category}} <i class="material-icons" @click="deleteRecept(recept.id)" style="cursor: pointer;">delete</i>
</li>
</ul>
<span @click="addRecept"><i class="material-icons" >add</i> Добавить</span> 
     <div class="file-field input-field">
          <div class="btn">
            <span>Изображение</span>
            <input type="file" @change="getImgFromModal">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text" placeholder="Выберите фото">
          </div>
        </div>

      </div>





    </div>
    <div class="modal-footer">
      <a href="#!" @click="addtoserver" class="waves-effect waves-green btn-flat">Добавить</a>
      <a href="#!" @click='closeModal' class=" waves-effect waves-green btn-flat">Закрыть</a>
    </div>
  </div>`
};
