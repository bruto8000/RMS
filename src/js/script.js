// setTimeout(()=>location.reload(), 6000) 


let password
if (document.cookie && document.cookie.includes('password')) {
    password = document.cookie.match(/password=\w+\s?/)[0].split('=')[1]
} else {
    password = ''
}



let app = new Vue({
    el: "#app",
    data: {
        dishes: [],
        ingredients: [],
        view: "loading", //Loading | dish | ing
        currentDish: {},
        currentIngredient: {},
        viewIng: "",
        currentAdd: {
            header: '',
            recept: {
                id: '',
                storage: ""
            },
            recepts: []
        },
        currentEdit: {
            header: '',
            recept: {
                id: '',
                storage: ""
            },
            recepts: []
        },
        currentComponent: '',
        dataForComponent: ''
    },
    mounted: function () {


        //GET DISHES
        axios.get('./vendor/getDishes.php')
            .then(res => {
                console.log(res)

                if (res.data.status == 'ERROR') {
                    res.data = []
                } else {
                    setTimeout(() => {
                        this.dishes = res.data;
                        this.view = 'dishes'
                        setTimeout(() => {
                            M.AutoInit();
                        }, 0);

                    }, 300);
                }

            })
        //GET Ingredients
        axios.get('./vendor/getIngredients.php')
            .then(res => {
                console.log(res)

                if (res.data.status == 'ERROR') {
                    res.data = []
                } else {
                    setTimeout(() => {
                        this.ingredients = res.data;

                        setTimeout(() => {

                            this.dishes.forEach((d) => {
                                console.log('ss2')
                                console.log(d)
                                let ingredientsWithNeeds = d.ingredients.split('ENDING');

                                let ingredients = [];
                                console.log(ingredientsWithNeeds)
                                ingredientsWithNeeds.forEach(element => {
                                    if (!element.length) {
                                        return
                                    }
                                    let finded = this.ingredients.find(v => {
                                        if (v.id == element.split('+')[0]) {
                                            return true;
                                        }
                                    })
                                    ingredients.push({
                                        name: finded.name,
                                        storage: finded.storage,
                                        need: element.split('+')[1],
                                        category: finded.category,
                                        id: finded.id
                                    })

                                });

                                d.IngredientsInUse = ingredients;
                            })
                        }, 50);
                    }, 1000);


                }

            })



    },
    methods: {
        //create dish Modal
        dishModal: function (idx) {
            console.log(idx)
            this.currentDish = this.dishes[idx];
            console.log(this.currentDish)
            if (!this.currentDish.showed) {
                this.currentDish.showed = true;
                this.currentDish.show = true;
            }
            console.log(location)
            setTimeout(() => {
                console.log(document.getElementById('dishModal'))
                location.href = "#" + 'dishAnchor'
                M.Modal.init(document.getElementById("dishModal"), {
                    inDuration: 0,
                    outDuration: 0
                }).open({})
            }, 20);
        },
        destroycomponent() {
            console.log('destroy Com')
            this.currentComponent = '';
            this.dataForComponent = ''
        },
        //create ingredientModal Modal
        ingredientModal: function (idx) {
            this.currentIngredient = this.ingredients[idx];
            this.currentIngredient.show = true;
            location.href = "#" + 'ingredientAnchor'
            setTimeout(() => {
                M.Modal.init(document.getElementById("ingredientModal"), {
                    inDuration: 0,
                    outDuration: 0
                }).open({})
            }, 0);
        },

        // create Add modal 

        addModal: function (modalType) {


            if (this.currentComponent.length > 0) this.currentComponent = '';
            this.dataForComponent = [];

            if (modalType == 'dish') {

                this.dataForComponent.push(this.ingredients);

                this.currentComponent = 'DishAddComponent'

            } else {
                this.currentComponent = 'IngAddComponent'
            }

        },
        editModal: function (modalType, current) {


            if (modalType == 'dish') {
                if (this.currentComponent.length > 0) this.currentComponent = '';
                this.dataForComponent = [],
                    this.dataForComponent.push(current),
                    this.dataForComponent.push(this.ingredients);

                this.currentComponent = 'DishEditComponent'
                console.log('EdiTcomponent')
            } else {
                if (this.currentComponent.length > 0) this.currentComponent = '';
                this.dataForComponent = [],
                    this.dataForComponent.push(current),


                    this.currentComponent = 'IngEditComponent'
                console.log('EdiTcomponent')


            }

        },
        getImgFromModal: function (edit) {
            if (edit == true) {
                this.currentEdit.img = document.getElementById('editImg').files[0];
            } else {
                this.currentAdd.img = document.getElementById('addImg').files[0];
            }


        },
        addToServer: function (data) {


            if (!password) {
                M.toast({
                    html: 'Нет пароля, хехе!'
                })
                return;
            }
            let url;
            let dataToServ = new FormData();
            if (data.type == 'ingredient') {
                let ing = data;
                url = './vendor/addIng.php'
                dataToServ.append('img', ing.img);
                dataToServ.append('name', ing.name);
                dataToServ.append('storage', ing.storage);
                dataToServ.append('category', ing.category);
                dataToServ.append('password', password)





            } else {
                let dish = data;

                url = './vendor/addDish.php'
                dataToServ.append('img', dish.img);
                dataToServ.append('name', dish.name);
                dataToServ.append('storage', dish.storage);
                dataToServ.append('category', dish.category);
                dataToServ.append('password', password)
                dataToServ.append('id', dish.id)
                dataToServ.append('ingredients', dish.ingredients)


            }

            axios.post(url, dataToServ, {
                    header: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    console.log(url)
                    console.log(res.data);
                    if (res.data.slice(0, 2) == 'OK') return;
                    else throw new Error;
                }).then(() => {
                    this.currentComponent = '';
                    M.toast({
                        html: 'Добавлено. Обновляю...',
                        displayLength: 5000
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 3000);

                })
                .catch((e) => {
                    console.log(e)
                    M.toast({
                        html: `Упс, что-то пошло не так. ${e}`,
                        displayLength: 5000
                    })
                })




        },



        editToServer: function (data) {

            ///VALIDATE
            if (!password) {
                M.toast({
                    html: 'Нет пароля, хехе!'
                })
                return;
            }


            if (data.type == 'ingredient') {







                let ing = data;

                let dataToServ = new FormData();


                dataToServ.append('img', ing.imgChanged ? ing.img : 'none');


                dataToServ.append('name', ing.name);
                dataToServ.append('storage', ing.storage);
                dataToServ.append('category', ing.category);
                dataToServ.append('password', password)
                dataToServ.append('id', ing.id)
                axios.post('./vendor/editIng.php', dataToServ, {
                        header: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((res) => {
                        console.log(res.data.slice(0, 2))
                        if (res.data.slice(0, 2) == 'OK') return;
                        else {
                            throw Error;
                        }
                    }).then(() => {
                        this.currentComponent = '';
                        M.toast({
                            html: 'Изменено. Обновляю...',
                            displayLength: 5000
                        })
                        setTimeout(() => {
                            location.reload();
                        }, 3000);

                    })
                    .catch((err) => {
                        console.error(err)
                        M.toast({
                            html: 'Упс, что-то пошло не так.',
                            displayLength: 5000
                        })
                    })

            } else {
                let dish = data;
                let dataToServ = new FormData();
                dataToServ.append('img', dish.imgChanged ? dish.img : 'none');
                dataToServ.append('name', dish.name);
                dataToServ.append('storage', dish.storage);
                dataToServ.append('category', dish.category);
                dataToServ.append('password', password)
                dataToServ.append('id', dish.id)
                dataToServ.append('ingredients', dish.ingredients)





                axios.post('./vendor/editDish.php', dataToServ, {
                        header: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((res) => {
                        console.log(res)
                        if (res.data.slice(0, 2) == 'OK') return;
                        else throw new Error;
                    }).then(() => {
                        this.currentComponent = '';
                        M.toast({
                            html: 'Изменено. Обновляю...',
                            displayLength: 5000
                        })
                        setTimeout(() => {
                            location.reload();
                        }, 3000);

                    })
                    .catch((e) => {
                        console.log(e)
                        M.toast({
                            html: `Упс, что-то пошло не так. ${e}`,
                            displayLength: 5000
                        })
                    })
            }


        },
        deleteFromServer(sure, id, type) {
            if (!sure) {
                M.toast({
                    html: `<span>Вы уверены?</span><button onclick='app.deleteFromServer(true, ${id}, "${type}")' class='btn-flat toast-action'>Да</button>`
                });
            } else {
                let url = '';
                if (type == "dish") {
                    url = './vendor/deleteDish.php'
                } else {
                    url = './vendor/deleteIng.php'
                }


                let dataToServ = new FormData();
                dataToServ.append('id', id)
                dataToServ.append('password', password)



                axios.post(url, dataToServ, {
                        header: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.slice(0, 2) != "OK") throw Error;
                        this.currentComponent = '';
                        M.toast({
                            html: 'Удалено. Обновляю...',
                            displayLength: 5000
                        })
                        setTimeout(() => {
                            location.reload();
                        }, 2000);

                    })
                    .catch((e) => {
                        console.log(e)
                        M.toast({
                            html: `Упс, что-то пошло не так. ${e}`,
                            displayLength: 5000
                        })
                    })




            }
        }


    },
    watch: {
        view: function (n, o) {
            if (this.viewIng == '')
                setTimeout(() => {
                    M.AutoInit();
                }, 0);


        },

    },

    components: {
        DishEditComponent: DishEditComponent,
        DishAddComponent: DishAddComponent,
        IngEditComponent: IngEditComponent,
        IngAddComponent: IngAddComponent
    }
})