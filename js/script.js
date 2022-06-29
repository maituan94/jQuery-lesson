//Document is ready
$(document).ready(function(){

    var books, proxybooks;
    // sort by field
    var sortBy = 'date'
    //sort direction asc: ascending and desc: descending
    var sortDir = 'desc'

    //Function remove book
    function removeBook(bookId) {

        // find the book with the book id
        var whichBook = _.find(books, function(item){
            return item.id == bookId;
        })

        // remove the book that find above
        books = _.without(books, whichBook);
    }

    //load book list
    function loadBooks(data) {
        // sort by name using underscore js
        if (sortDir === 'asc') {
            data = _.sortBy(data, sortBy);
        } else {
            data = _.sortBy(data, sortBy).reverse();
        }

        $.addTemplateFormatter('formatDate', function(value){
            return $.format.date(new Date(value), 'MM/dd hh:mm');
        }); // date formatter
        

        $('#Books').loadTemplate('../books.html', data, {
            complete: function() {
                $('.book-delete').on('click', function(){
                    /* - this here means the current element
                       - select to the parent of this element
                       - then remove the item using remove() method
                    */
                    $(this).parents('.book-item').hide(300, function(){ // hide method animation with duration as 300ms
                        let bookId = $(this).attr('id');
                        removeBook(bookId);//remove book item
                        //$(this).remove(); //remove book item
                    })
                }) // delete book
            } // complete binding books data
        }); // load templete
    }

    $.ajax({
        url: '/data/books.json',
    }).done(function(data) {
        proxybooks = books = data;
        loadBooks(data);
    }) // Ajax loaded

    //EVENTS

    // Typing in search
    $('#SearchBook').keyup(function(){
        let searchText = $(this).val();
        proxybooks = _.filter(books, function(item){
            return item.name.toLowerCase().match(searchText.toLowerCase()) || item.author.toLowerCase().match(searchText.toLowerCase());
        }) // filter books

        //reload books
        loadBooks(proxybooks)
    }) // keyup on search

    //on item drop down click
    $('.dropdown-menu .dropdown-item').on('click', function(){
        let sortDropdown = $(this).attr('id');
        
        switch (sortDropdown) {
            case 'sortName': //sort by name
                $('.sort-by').removeClass('active');
                sortBy = 'name';
                break;
            case 'sortDate': //sort by name
                $('.sort-by').removeClass('active');
                sortBy = 'date';
                break;
            case 'sortAuthor': //sort by name
                $('.sort-by').removeClass('active');
                sortBy = 'author';
                break;
            case 'sortAsc': //ascending sort
                $('.sort-dir').removeClass('active');
                sortDir = 'asc';
                break;
            case 'sortAuthor': //descending sort
                $('.sort-dir').removeClass('active');
                sortDir = 'desc';
                break;
        }

        $(this).addClass('active');
        //reload list
        loadBooks(books);
    })

    //on submit book form
    $('#bookForm').submit(function(e) {
        let newBook = {}
        e.preventDefault(); // prevent the default action, this wont reload the page

        //add fields to newBook object
        newBook.name = $('#bookName').val();
        newBook.author = $('#bookAuthor').val();
        newBook.date = $('#bookDate').val();
        newBook.notes = $('#bookNotes').val();

        //add to books
        books.push(newBook);
        loadBooks(books);
        //reset form
        $('#bookForm')[0].reset();
    })
});
