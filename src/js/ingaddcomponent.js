let IngAddComponent = {

    props: ['dataforcomponent',],
    data: function () {

        return {
            ingredient: {},      
            modal : ""
        }
    },
    mounted: function () {

        setTimeout(() => {   
            M.FormSelect.init(document.querySelectorAll('select'));
        }, 5);

        console.log('mounted Ing ADd Component')
     
this.modal = M.Modal.init(this.$el, {
    onCloseEnd:  ()=>{
       this.closeModal();
    }
})
this.modal.open();
    }

    ,
    methods: {
 
        addToServer() {



            if (this.ingredient.name == '' || !this.ingredient.category || !this.ingredient.storage || isNaN(Number(this.ingredient.storage)) || !this.ingredient.img) {
                M.toast({
                    html: 'Вы что-то пропустили или ошиблись.'
                })
                return;
            }else{
             
 

            this.ingredient.type='ingredient';
            this.$emit('addtoserver', this.ingredient)
}
        },
        closeModal () {
            this.modal.close()
            this.modal.destroy()
            this.$emit('destroycomponent')
        },
        getImgFromModal(ev) {
console.log(ev.target.files[0])
if(!this.ingredient.imgChanged){
this.ingredient.imgChanged = true;
this.ingredient.img = ev.target.files[0];
}
else{
    this.ingredient.imgChanged = false;
}
        }
    },


    template: `
    <div id="editModal" class="modal">


    <div class="modal-content row">
      <div class="col s12">
        <h4>Добавление ингредиента</h4>

        <input type="text"class="input-field" v-model="ingredient.name" placeholder="Имя">
 

        <input type="text" class="input-field" v-model="ingredient.storage" placeholder="Остаток"> 
        <select name="" id=""  v-model="ingredient.category">
        <option value="" disabled>тип</option>
        <option value="кг">кг</option>
        <option value="шт">шт</option>
      </select>




     <div class="file-field input-field">
          <div class="btn">
            <span>Изображение</span>
            <input type="file" @change="getImgFromModal">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text" placeholder="Не трогайте, если не хотите менять.">
          </div>
        </div>

      </div>





    </div>
    <div class="modal-footer">
      <a href="#!" @click="addToServer" class="waves-effect waves-green btn-flat">Добавить</a>
      <a href="#!" @click='closeModal' class=" waves-effect waves-green btn-flat">Закрыть</a>
    </div>
  </div>`
};











