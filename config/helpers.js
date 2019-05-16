
const helpers = {}


helpers.registerHelper("review_table", (review_table) => {
    var moyenne=0;
    review_table.forEach((element) => {
        moyenne = moyenne + parseInt(element.grade);
    })
    moyenne = moyenne / review_table.length;
    return moyenne;
});

helpers.matchPassword = async (password, savedPassword) => {
  try{
    return await bcrypt.compare(password, savedPassword)
  }catch(e){
    console.log(e)
  }
};







module.exports = helpers