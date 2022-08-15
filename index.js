const {createApp, ref, onMounted} = Vue;

const app = createApp({
    setup(){
        const url = "http://localhost:7777/self_improvement";

        const self_improvement = ref({
            id:null,
            title:"",
            author:"",
            publisher:"",
            publication_year:"",
            list:[],
            errorMessage:"",
            isError:false,
            isUpdate:false,
        });

        const getSelf_improvement = async () => {
            try {
              self_improvement.value.isUpdate = false;
              const resSelf_improvement = await axios.get(url);
              if (resSelf_improvement.data.length === 0)
                throw new Error("Buku Tidak Tersedia");
              self_improvement.value.list = resSelf_improvement.data;
              return resSelf_improvement.data;
            } catch (err) {
              self_improvement.value.isError = true;
              self_improvement.value.errorMessage = err.message;
              self_improvement.value.isUpdate = false;
            }
        };

        const getSelf_improvementById = async (id) =>{
            try{
                const resSelf_improvement = await axios.get(url + `/${id}`);
                if (resSelf_improvement.data.length === 0)
                    throw new Error("Buku Tidak Tersedia");
                self_improvement.value.isUpdate = true;
                self_improvement.value.id = id;
                self_improvement.value.title = resSelf_improvement.data.title;
                self_improvement.value.author = resSelf_improvement.data.author;
                self_improvement.value.publisher = resSelf_improvement.data.publisher;                
                self_improvement.value.publication_year = resSelf_improvement.data.publication_year;
                return resSelf_improvement.data;                
            } catch (err){
                self_improvement.value.title ="";
                self_improvement.value.author ="";
                self_improvement.value.publisher ="";
                self_improvement.value.publication_year ="";
                self_improvement.value.isUpdate = "false";
                self_improvement.value.isError = "true";
                self_improvement.value.errorMessage = err.message;
            }
        };

        const submitSelf_improvement = async () => {
            try {
                self_improvement.value.isUpdate = false;
                const post = await axios.post(url + "/create", {
                  title: self_improvement.value.title,
                  author: self_improvement.value.author,
                  publisher: self_improvement.value.publisher,
                  publication_year: self_improvement.value.publication_year,
                });
                self_improvement.value.isError = false;
                self_improvement.value.title = "";
                self_improvement.value.author = "";
                self_improvement.value.publisher = "";
                self_improvement.value.publication_year = ""; 
                self_improvement.value.isUpdate = false;
                if (!post) throw new Error("Gagal Menambah Data Buku");
                await getSelf_improvement();
              } catch (err) {
                self_improvement.value.isError = true;
                self_improvement.value.errorMessage = err.message;
              } 
        };

        const updateSelf_improvement = async () => {
            try {
              self_improvement.value.isUpdate = true;
              const put = await axios.put(url + "/update", {
                id: self_improvement.value.id,
                title: self_improvement.value.title,
                author: self_improvement.value.author,
                publisher: self_improvement.value.publisher,
                publication_year: self_improvement.value.publication_year,
              });
              self_improvement.value.isError = false;
              self_improvement.value.title = "";
              self_improvement.value.author = "";
              self_improvement.value.publisher = "";
              self_improvement.value.publication_year = "";
              self_improvement.value.isUpdate = false;
              self_improvement.value.isError = true;
              if (!put) throw new Error("Gagal Memperbaharui Data Buku");
              await getSelf_improvement();
            } catch (err) {
              self_improvement.value.isUpdate = false;
              self_improvement.value.isError = true;
              self_improvement.value.errorMessage = err.message;
            }
          };

        const deleteSelf_improvement = async (id) => {
            try {
              self_improvement.value.isUpdate = false;
              const resSelf_improvement = await axios.delete(url + "/delete", {
                data: {
                  id,
                },
              });
              if (resSelf_improvement.data.length === 0)
                throw new Error("Buku Tidak Tersedia");
              self_improvement.value.list = resSelf_improvement.data;
              await getSelf_improvement();
              return resSelf_improvement.data;
            } catch (err) {
              self_improvement.value.isError = true;
              self_improvement.value.errorMessage = err.message;
            }
        };

        onMounted(async () => {
            await getSelf_improvement();
        });

        return{
            self_improvement,
            getSelf_improvementById,
            submitSelf_improvement,
            updateSelf_improvement,
            deleteSelf_improvement,
        }

    },
    
});