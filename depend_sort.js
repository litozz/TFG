function sortDepend(array1,array2){
    var zipped = [],
        i;
    
    for(i=0; i<array1.length; ++i) {
        zipped.push({
            array1elem: array1[i],
            array2elem: array2[i]
        });
    }
    
    zipped.sort(function(left, right) {
        var leftArray1elem = left.array1elem,
            rightArray1elem = right.array1elem;
    
        return leftArray1elem === rightArray1elem ? 0 : (leftArray1elem < rightArray1elem ? -1 : 1);
    });
    
    array1 = [];
    array2 = [];
    for(i=0; i<zipped.length; ++i) {
        array1.push(zipped[i].array1elem);
        array2.push(zipped[i].array2elem);
    }
    
    
    sorted_array=new Array(2);
    sorted_array[0]=array1;
    sorted_array[1]=array2;
    return sorted_array;
}