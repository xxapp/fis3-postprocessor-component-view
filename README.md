## 用法
``` html
<!-- 处理之前 -->
<style>
    .control-file :global .input-group-btn > input {
        position: absolute;
        clip: rect(0 0 0 0);
        outline: none;
    }
</style>
<template>
    <div class="form-group control-file">
        <label class="control-label">头像</label>
        <div class="input-group">
            <input type="text" class="form-control" disabled>
            <span class="input-group-btn">
                <label class="btn btn-info" for="foo">选择图片</label>
                <input type="file" name="file" id="foo">
            </span>
        </div>
    </div>
</template>
```

``` js
// fis-conf.js
// ...
fis.match('/components/**/*.html', {
    postprocessor: fis.plugin('component-view', { })
});
// ...
```

``` html
<!-- 处理之后 -->
<style>
    .control-file_wvqyx_3 .input-group-btn > input {
        position: absolute;
        clip: rect(0 0 0 0);
        outline: none;
    }
</style>
<template>
    <div class="form-group control-file_wvqyx_3 ">
        <label class="control-label">头像</label>
        <div class="input-group">
            <input type="text" class="form-control" disabled>
            <span class="input-group-btn">
                <label class="btn btn-info" for="foo">选择图片</label>
                <input type="file" name="file" id="foo">
            </span>
        </div>
    </div>
</template>
```