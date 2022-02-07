import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import NewPost from "../views/NewPost.vue";
import PostDetail from "../views/PostDetail.vue";
import EditProfile from "../views/EditProfile";
import Admin from "../views/Admin";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/accueil",
    name: "Home",
    component: Home,
  },
  {
    path: "/nouvel-article",
    name: "NewPost",
    component: NewPost,
  },
  {
    path: "/article-detail/:id",
    name: "PostDetail",
    component: PostDetail,
  },
  {
    path: "/mon-profil",
    name: "EditProfile",
    component: EditProfile,
  },
  {
    path: "/administration",
    name: "Admin",
    component: Admin,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
