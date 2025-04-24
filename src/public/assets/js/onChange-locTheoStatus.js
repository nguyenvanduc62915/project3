function handleChangeStatus() {
    const slt = document.querySelector('select[name="locTheoStatus"]');
    const selectedValue = slt.value || "";    
    
    const searchAD = `<%= ssSearchAd %>` 
    console.log("searchAD: ",searchAD);
    let url = '/list-account-admin';
        
    // if (searchAD && searchAD.trim() !== "") {
    //     url += `?searchAD=${encodeURIComponent(searchAD)}`;
    // }

    if (url.includes('?')) {    // kiểm tra xem URL đã chứa dấu ? hay chưa
        url += `&locTheoStatus=${selectedValue}`;
    } else {
        url += `?locTheoStatus=${selectedValue}`;
    }
    
    window.location.href = url;
}