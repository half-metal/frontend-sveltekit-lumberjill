<script>
    import { themeChange } from 'theme-change'
    import { beforeUpdate } from 'svelte';
    import ThemeChange from '$lib/components/ThemeChange.svelte'
    import NavMenu from '$lib/components/NavMenu.svelte'
      import "../app.css";
    </script>
  
  <div class="navbar bg-secondary relative text-black" style="z-index: 600">
  
  
    <div class="flex-1  relative">
      <a class="btn btn-ghost normal-case text-xl" href="https://daisyui.com/components/navbar/">LumberJill</a>
      <div class="flex place-content-center">
        <NavMenu/>
        <ThemeChange/>
      </div>
    </div>
  
  
  
  
  
  
  </div>
  
  <!-- <ThemeChange/> -->
    
    <slot />