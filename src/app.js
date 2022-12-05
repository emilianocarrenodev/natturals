import './scss/style.scss';
import * as bootstrap from 'bootstrap';

import Swiper, { Autoplay, Navigation, Pagination, Thumbs } from 'swiper';
Swiper.use([Autoplay, Navigation, Pagination, Thumbs]);

/*All 'load' load the recurring blocks*/
/*$("header").load("header.html");

$("footer").load("footer.html", function () {

    document.querySelector(".btn-top").addEventListener("click", function(event) {
        event.preventDefault();

        $("html, body").animate({scrollTop: 0}, 1000);
    }, false);

});

$(".container-sidebar").load("block-sidebar.html");*/

/*Scroll top*/
document.querySelector(".btn-top").addEventListener("click", function(event) {
    event.preventDefault();
    $("html, body").animate({scrollTop: 0}, 1000);
}, false);

/*Modals*/
const modal_list = new bootstrap.Modal("#modal-list");
const modal_login = new bootstrap.Modal("#modal-login");
const modal_error = new bootstrap.Modal("#modal-error");
const modal_fidelia = new bootstrap.Modal("#modal-fidelia");
const modal_newsletter = new bootstrap.Modal("#modal-newsletter");
const modal_add_to_card = new bootstrap.Modal("#modal-add-to-card");
const modal_filter_marques = new bootstrap.Modal("#modal-filter-marques");

/*Sidebar*/
$(".container-sidebar").on("click", ".container-sidebar-collapse .btn-secondary", function() { 
    $(".container-sidebar .container-sidebar-collapse .btn-secondary").removeClass("active");
    $(this).addClass("active");
});

$(".container-sidebar").on("change", "input[name='terms'],input[name='offers']", function() { 
    document.getElementById('form-sidebar').submit();
});

$("header").on("click", ".container-sidebar-collapse .btn-secondary", function() { 
    $("header .container-sidebar-collapse .btn-secondary").removeClass("active");
    $(this).addClass("active");
});

$("header").on("change", "input[name='terms']", function() { 
    document.getElementById('form-header-sidebar').submit();
});

$(".container-sidebar").on("change", "input[name='price[]']", function() {

    let parent_id = $(this).attr("id");
    
    $(".container-sidebar input[name='price[]']").each(function() {

        if($(this).is(':checked')) {
    
            if(parent_id != $(this).attr("id")) {
                $(this).prop('checked', false);
            }
        }
    });

    document.getElementById('form-sidebar').submit();
});

/*Contact Form 7*/
document.addEventListener('wpcf7mailsent', function() {
    location = '/contacte/gracies/';
}, false);

/*Swiper*/
var swiper_product_sheet_thumbs = new Swiper(".swiper-product-sheet-thumbs", {
    spaceBetween: 8,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
        nextEl: ".swiper-button-next"
    },
});
new Swiper(".swiper-product-sheet-main", {
    spaceBetween: 2,
    thumbs: {
        swiper: swiper_product_sheet_thumbs,
    },
});

// Loop over them and prevent submission
document.querySelectorAll('.valid-password').forEach(el => el.addEventListener('input', event => {

    let val_new =  document.getElementById("newPassword");
    let val_confirm =  document.getElementById("confirmPassword");

    if (val_new.value != val_confirm.value) {
        val_new.setCustomValidity("Les contrasenyes no són iguals.");
        val_confirm.setCustomValidity("Les contrasenyes no són iguals.");
    } else {
        val_new.setCustomValidity("");
        val_confirm.setCustomValidity("");
    }

}));

const needs_validation = document.querySelectorAll(".needs-validation");

Array.from(needs_validation).forEach(form => {

    form.addEventListener("submit", event => {

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        form.classList.add("was-validated");
    }, false)
});

/*Form create account*/
$("input[name='input_radio_facturacio_or_diferent']").on("change", function () {

    var is_required = document.querySelectorAll(".container-different-direction .is-required");

    if(this.value == "diferent") {

        $(".container-different-direction").fadeIn();

        is_required.forEach(element => {
            element.setAttribute("required", '');
        });

    } else {
        
        $(".container-different-direction").hide();

        is_required.forEach(element => {
            element.removeAttribute("required");
        });
    }
});

/*Function add to cart*/
$(".btn-add-cart").on("click", function(event){ 
    event.preventDefault();

    let btn_this = $(this);

    let form = btn_this.closest("form.cart");

    let input_title = form.find("input[name=title]").val();
    let input_image = form.find("input[name=image]").val();
    let input_product_qty = form.find("input[name=quantity]").val();
    let input_product_id = form.find("input[name=product_id]").val();

    var data = {
        title: input_title,
        image: input_image,
        quantity: input_product_qty,
        product_id: input_product_id,
        action: "ql_woocommerce_ajax_add_to_cart",
    };

    $.ajax({
        type: "post",
        url: "/wp-admin/admin-ajax.php",
        data: data,
        beforeSend: function () {
            btn_this.addClass("disabled");
            $("#spinner-loading").addClass("show");
        },
        complete: function () {
            btn_this.removeClass("disabled");
            $("#spinner-loading").removeClass("show");
        }, 
        error: function () {

            modal_error.show();

            setTimeout(function () {
                modal_error.hide();
            }, 3000);
        },
        success: function (response) {

            $("#spinner-loading").removeClass("show");

            if (response.status) {

                $("#modal-add-to-card h3").html(response.title);
                $("#modal-add-to-card .img-fluid").attr("src", response.image);

                modal_add_to_card.show();

                setTimeout(function () {
                    modal_add_to_card.hide();
                }, 5000);

            } else { 

                modal_error.show();

                setTimeout(function () {
                    modal_error.hide();
                }, 3000);
            } 
        }, 
    }); 
});

$(document).on("click", "#modal-filter-marques .btn-filter-marques-alphabet",  function(event){ 
    event.preventDefault();
        
    let data_alphabet = $(this).data("alphabet");

    var data = {
        data_alphabet: data_alphabet,
        action: "ql_woocommerce_ajax_marques_alphabet",
    };

    $.ajax({
        type: "post",
        url: "/wp-admin/admin-ajax.php",
        data: data,
        beforeSend: function () {
            $("#spinner-loading").addClass("show");
        },
        complete: function () {
            $("#spinner-loading").removeClass("show");
        }, 
        error: function () {

            modal_error.show();

            setTimeout(function () {
                modal_error.hide();
            }, 3000);
        },
        success: function (response) {

            $("#title-list-modal-filter-marques").empty().html(data_alphabet);
            $("#container-list-modal-filter-marques").empty();

            if(response.results.length > 0) {

                response.results.forEach(element => {

                    let text_html = `<div class="col-12 col-lg-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" data-value="${element.slug}" data-name="${element.name}" data-id="checkbox-modal-filter-marques-${element.slug}" id="checkbox-modal-filter-marques-aux-${element.slug}">
                            <label class="form-check-label" for="checkbox-modal-filter-marques-aux-${element.slug}">${element.name}</label>
                        </div>
                    </div>`;

                    $("#container-list-modal-filter-marques").append(text_html);
                });
            }
        }, 
    });
});

$(document).on("change", "#modal-filter-marques .form-check-input", function() {

    let data_id = $(this).data("id");

    if($(this).is(':checked')) {

        if ($(`#hidden-${data_id}`).length == 0) {
        
            let data_name = $(this).data("name");
            let data_value = $(this).data("value");

            let text_html = `<li id="hidden-${data_id}">
                <span class="badge text-bg-primary">${data_name}<a href="${data_id}" class="btn-remove-filter-marques"><i class="lni lni-close"></i></a></span>
                <input type="hidden" form="form-sidebar" name="tags[]" value="${data_value}">
            </li>`;

            $("#container-list-badge").append(text_html);

            $(`#${data_id}`).prop('checked', true);
        }

    } else {

        $(`#hidden-${data_id}`).remove();
        $(`#${data_id}`).prop('checked', false);
    }

});

$(".container-sidebar").on("change", ".form-check-input-tags", function() {

    let data_id = $(this).attr("id");

    if($(this).is(':checked')) {

        if ($(`#hidden-${data_id}`).length == 0) {
        
            let data_name = $(this).data("name");
            let data_value = $(this).data("value");

            let text_html = `<li id="hidden-${data_id}">
                <span class="badge text-bg-primary">${data_name}<a href="${data_id}" class="btn-remove-filter-marques"><i class="lni lni-close"></i></a></span>
                <input type="hidden" form="form-sidebar" name="tags[]" value="${data_value}">
            </li>`;

            $("#container-list-badge").append(text_html);
        }

    } else {

        $(`#hidden-${data_id}`).remove();
    }

    document.getElementById('form-sidebar').submit();
});

$(document).on("click", "#modal-filter-marques .btn-remove-filter-marques",  function(event){ 
    event.preventDefault();

    let data_href = $(this).attr("href");

    $(`#hidden-${data_href}`).remove();
    $(`#${data_href}`).prop('checked', false);
});

$(document).on("click", "#offcanvas-coupons .container-left .container-close .btn-close", function(event){ 
    event.preventDefault();

    $("#offcanvas-coupons").removeClass("display-active");

    $("#offcanvas-coupons .container-left .container-main").hide();

});

$(document).on("click", "#offcanvas-coupons .container-cupons .container-items .img-fluid", function(event){ 
    event.preventDefault();

    let target = $(this).data("target");

    $("#offcanvas-coupons .container-left .container-main").hide();
    $(target).show();
    
    $("#offcanvas-coupons").removeClass("display-active").addClass("display-active");

});

$(document).on('click', '.btn-see-list', function(event){ 
    event.preventDefault();

    $('.productesLlista').hide();

    $(this).parent().parent().parent().find('.productesLlista').slideToggle();
});