document.addEventListener("DOMContentLoaded", function () {
    // Role selection script
    document.getElementById('roleParent').addEventListener('click', function () {
        document.getElementById('roleParent').classList.add('active');
        document.getElementById('roleChild').classList.remove('active');
    });
    document.getElementById('roleChild').addEventListener('click', function () {
        document.getElementById('roleChild').classList.add('active');
        document.getElementById('roleParent').classList.remove('active');
    });
    
});  