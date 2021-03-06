require('./bootstrap');

window.Vue = require('vue').default;

import Vue from 'vue';
import LoadingComponent from './components/LoadingComponent.vue'
import CalendarListComponent from './components/CalendarListComponent.vue'
import Calendar from './components/Calendar/Calendar.vue'
import HelpersListComponent from './components/Calendar/Helpers/HelpersListComponent.vue'
import Swal from "sweetalert2";
import { message } from 'laravel-mix/src/Log';

Vue.component('calendar', Calendar);
Vue.component('loading-component', LoadingComponent);
Vue.component('calendar-component', CalendarListComponent);
Vue.component('helpers-list', HelpersListComponent);

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

const app = new Vue({
    el: '#app',
    data: {
        me: {},
        show_loading: false,
        currentRoute: window.location.pathname,
        calendars: [],
        helper_calendars: [],
        selected_calendar: null,
        newCalendarForm: {
            title: "",
            start_date: "",
            end_date: "",
            description: null,
        },
        editCalendarForm: {
            title: "",
            start_date: "",
            end_date: "",
            description: null,
        },
        error: "",
        categories: [],
        newCategory: "",
        selected_category: "",
        date_range_export: {
            start: null,
            end: null,
            calendar_id: null,
        },
        allCalendars: [],
        user_password: "",
        export_events: []
    },

    methods: {
        getCalendars() {
            let _this = this;
            this.show_loading = true;
            $.ajax({
                url: "/calendars",
                method: "GET",
                dataType: "JSON",
            }).done(function (response) {
                _this.calendars = response;
            }).fail(function (error) {
                Swal.fire("Error!", "Can\'t get owner calendars", "error");
            }).always(() => {
                this.show_loading = false;
            });
        },

        getHelperCalendars() {
            let _this = this;
            this.show_loading = true;
            $.ajax({
                url: "/helper_calendars",
                method: "GET",
                dataType: "JSON",
            }).done(function (response) {
                _this.helper_calendars = response;
            }).fail(function (error) {
                Swal.fire("Error!", "Can\'t get helper calendars", "error");
            }).always(() => {
                this.show_loading = false;
            });
        },

        getAllMyCalendars() {
            let _this = this;
            this.show_loading = true;
            $.ajax({
                url: "/all_calendars",
                method: "GET",
                dataType: "JSON",
            }).done(function (response) {
                _this.allCalendars = response;

                _this.$nextTick(function () {
                    let select_export = $('#export_range_calendar').selectize({
                        create: false,
                        sortField: 'text',
                        onChange: function onChange(value) {
                            _this.date_range_export.calendar_id = value;
                        }
                    })
                })
            }).fail(function (error) {
                Swal.fire("Error!", "Can\'t get calendars", "error");
            }).always(() => {
                this.show_loading = false;
            });
        },

        storeCalendar() {
            let _this = this
            this.error = ""
            $.ajax({
                url: '/calendar_store',
                dataType: 'JSON',
                method: 'POST',
                data: _this.newCalendarForm
            }).done(function (response) {
                _this.calendars.push(response)
                $('#newCalendarModal').modal('hide')
                Object.keys(_this.newCalendarForm).forEach((elem) => { _this.newCalendarForm[elem] = "" })
            }).fail(function (error) {
                _this.error = error.responseJSON.message
            })
        },

        removeCalendar(calendar_id) {
            let _this = this

            Swal.fire({
                title: 'Are you sure to delete this calendar?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: '/calendar_destroy',
                        method: "DELETE",
                        dataType: "JSON",
                        data: {id: calendar_id}
                    }).done((response) => {
                        let index = _this.calendars.findIndex(cal => cal.id == calendar_id)
                        if (index > -1)
                            _this.calendars.splice(index, 1)

                        index = _this.allCalendars.findIndex(cal => cal.id == calendar_id)
                        if (index > -1)
                            _this.allCalendars.splice(index, 1)
                    }).fail((error) => {
                        Swal.fire("Error!", error?.responseJSON?.message, "error");
                    })
                }
            })
        },

        editCalendar(calendar_id){
            let calendar = this.calendars.find(cal => cal.id == calendar_id)

            if(!calendar)
                return

            this.editCalendarForm.id = calendar_id
            this.editCalendarForm.title = calendar.title
            this.editCalendarForm.start_date = calendar.start_date
            this.editCalendarForm.end_date = calendar.end_date
            this.editCalendarForm.description = calendar.description

            $('#end-date-edit').val(calendar.end_date)
            $('#start-date-edit').val(calendar.start_date)

            $('#editCalendarModal').modal('show')
        },

        updateCalendar(){
            let _this = this
            this.error = ""
            $.ajax({
                url: '/calendar_update',
                dataType: 'JSON',
                method: 'PATCH',
                data: _this.editCalendarForm
            }).done(function (response) {
                let index = _this.calendars.findIndex(cal => cal.id == _this.editCalendarForm.id)
                _this.calendars[index] = response
                $('#editCalendarModal').modal('hide')
                Object.keys(_this.editCalendarForm).forEach((elem) => { _this.editCalendarForm[elem] = "" })
            }).fail(function (error) {
                _this.error = error.responseJSON.message
            })
        },

        getCategories() {
            let _this = this;
            this.show_loading = true;
            $.ajax({
                url: '/user_categories',
                dataType: "JSON",
                method: 'GET',
            }).done((response) => {
                _this.categories = response
            }).fail((response) => {
                Swal.fire("Error!", "Can\'t get categories", "error");
                _this.categories = _this.categories || []
            }).always(() => {
                _this.show_loading = false;
            })
        },


        storeCategory() {
            let _this = this
            this.error = ""
            this.show_loading = true;
            $.ajax({
                url: '/category_store',
                dataType: 'JSON',
                method: 'POST',
                data: { name: _this.newCategory }
            }).done(function (response) {
                _this.categories.push(response)
                $('#newCategoryModal').modal('hide');
            }).fail(function (error) {
                _this.error = error.responseJSON.message
            }).always(() => {
                _this.show_loading = false;
            })
        },

        deleteCategory(id) {
            let _this = this
            this.show_loading = true;
            $.ajax({
                url: '/category_delete',
                dataType: "JSON",
                method: 'DELETE',
                data: { id: id }
            }).done((response) => {
                let index = _this.categories.findIndex(cat => cat.id == id)
                if (index != -1)
                    _this.categories.splice(index, 1)
            }).fail((response) => {
                let message = response?.responseJSON?.message != null ? response.responseJSON.message : "Can\'t delete category";
                Swal.fire("Error!", message, "error");
                _this.categories = _this.categories || []
            }).always(() => {
                _this.show_loading = false;
            })
        },

        updateCategory() {
            let _this = this
            this.show_loading = true;
            $.ajax({
                url: '/category_update',
                dataType: "JSON",
                method: 'PATCH',
                data: { id: _this.selected_category, name: _this.newCategory }
            }).done((response) => {
                let index = _this.categories.findIndex(cat => cat.id == _this.selected_category)
                if (index != -1)
                    _this.categories.splice(index, 1, response)
                $('#editCategoryModal').modal('hide')
            }).fail((response) => {
                _this.error = response.responseJSON.message
                _this.categories = _this.categories || []
            }).always(() => {
                _this.show_loading = false;
            })
        },

        getMe() {
            let _this = this
            $.ajax({
                url: '/me',
                dataType: 'JSON',
                method: 'GET',
            }).done(function (response) {
                _this.me = response
            }).fail(function (error) {
                console.error(error)
            })
        },

        async getToken() {
            let _this = this
            try {
                return await $.ajax({
                    url: '/api/getToken',
                    dataType: "JSON",
                    method: 'POST',
                    data: { email: _this.me.email, password: _this.user_password }
                });
            } catch (error) { }
        },

        getExportEvents() {
            let _this = this;
            (async function () {
                let token = (await _this.getToken())?.access_token
                _this.show_loading = true;
                $.ajax({
                    url: '/api/export_events',
                    method: 'GET',
                    data: _this.date_range_export,
                    headers: { Authorization: `Bearer ${token}` },
                }).done((response) => {
                    _this.export_events = response
                    _this.error = ''
                }).fail((error) => {
                    let message = typeof error?.responseJSON?.message == 'object' ? 'Invalid Data' : error?.responseJSON?.message
                    Swal.fire("Error!", message, "error");
                    _this.error = message
                }).always(() => { _this.show_loading = false; })
            })(_this)
        },

        redirect(url) {
            window.location.href = url
        },

        generateDownload(filename, data) {
            let element = document.createElement('a');
            element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },

        openUpload() {
            $('#targets').trigger('click')
        }
    },

    mounted() {
        let _this = this

        if (this.currentRoute != '/login' && this.currentRoute != '/signup')
            this.getMe()

        if (this.currentRoute == '/') {
            _this.getCalendars()
            _this.getHelperCalendars()
        }

        if (this.currentRoute == '/export_events') {
            _this.getAllMyCalendars()
        }

        if (typeof route_user_categories !== 'undefined')
            this.getCategories();

        // Login
        document.querySelectorAll('input')?.forEach(input => {
            input.addEventListener('focusout', (event) => {
                event.target.classList.remove('active')
            })
        })

        $("#nation_id").selectize({
            create: false,
            sortField: "text",
        })

        document.querySelectorAll('input')?.forEach(input => {
            input.addEventListener('keydown', (event) => {
                if(event.getModifierState('CapsLock'))
                    $(event.target.parentElement).find('.caps-lock').removeClass('d-none')
                else
                    $(event.target.parentElement).find('.caps-lock').addClass('d-none')
            })
            input.addEventListener('focusin', (event) => {
                event.target.classList.remove('invalid')
                event.target.classList.add('active')
            })
        })

        $('.datepickerrange').daterangepicker({
            startDate: moment().format("YYYY-MM-DD"),
            "showDropdowns": true,
            autoApply: false,
            autoUpdateInput: false,
            locale: {
                format: 'YYYY-MM-DD'
            }
        });

        $('.datepickerrange').on('apply.daterangepicker', function (ev, picker) {
            _this.date_range_export.start = picker.startDate.format('YYYY-MM-DD HH:mm:ss')
            _this.date_range_export.end = picker.endDate.format('YYYY-MM-DD HH:mm:ss')
            $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'))
        })

        $('.datepicker').daterangepicker({
            singleDatePicker: true,
            startDate: moment().subtract(18, 'years').format("YYYY-MM-DD"),
            "maxDate": moment().subtract(18, 'years').format("YYYY-MM-DD"),
            "showDropdowns": true,
            locale: {
                format: 'YYYY-MM-DD'
            }
        });

        const config = {
            singleDatePicker: true,
            startDate: moment().format("YYYY-MM-DD"),
            "showDropdowns": true,
            autoUpdateInput: false,
            autoApply: false,
            locale: {
                format: 'YYYY-MM-DD'
            }
        }
        $('.datepicker-years').daterangepicker(config);

        $('.datepicker-years').on('apply.daterangepicker', function (ev, picker) {
            if ($(this).attr('id') == 'start-date') {
                _this.newCalendarForm.start_date = picker.startDate.format('YYYY-MM-DD')
            } else if ($(this).attr('id') == 'end-date') {
                _this.newCalendarForm.end_date = picker.startDate.format('YYYY-MM-DD')
            }
            $(this).val(picker.startDate.format('YYYY-MM-DD'))
        })

        $('#end-date-edit,#start-date-edit').daterangepicker(config);
        $('#end-date-edit,#start-date-edit').on('apply.daterangepicker', function (ev, picker) {
            if ($(this).attr('id') == 'start-date-edit') {
                _this.editCalendarForm.start_date = picker.startDate.format('YYYY-MM-DD')
            } else if ($(this).attr('id') == 'end-date-edit') {
                _this.editCalendarForm.end_date = picker.startDate.format('YYYY-MM-DD')
            }
            $(this).val(picker.startDate.format('YYYY-MM-DD'))
        })

        document.querySelector('#terms')?.addEventListener('change', function () {
            if (this.checked) {
                document.querySelector('#login').classList.add('btn-opacity-1')
                document.querySelector('#login').disabled = false
            } else {
                document.querySelector('#login').disabled = true
                document.querySelector('#login').classList.remove('btn-opacity-1')
            }
        })

        document.querySelector('#auth-form')?.addEventListener('submit', function (event) {
            if (!document.querySelector('#terms').checked)
                event.preventDefault()
        })


        // Side Bar
        const showNavbar = (toggleId, navId, bodyId, headerId) => {
            const toggle = document.getElementById(toggleId),
                nav = document.getElementById(navId),
                bodypd = document.getElementById(bodyId),
                headerpd = document.getElementById(headerId)

            // Validate that all variables exist
            if (toggle && nav && bodypd && headerpd) {
                toggle.addEventListener('click', () => {
                    // show navbar
                    nav.classList.toggle('show')
                    // add padding to body
                    bodypd.classList.toggle('body-pd')
                    // add padding to header
                    headerpd.classList.toggle('body-pd')
                })
            }
        }
        showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')


        //popup already or becomeHelper
        if ($('#alreadyHelper').length)
            Swal.fire('Warning!', 'You are already helper of calendar ' + $('#alreadyHelper').text(), 'warning')

        if ($('#becomeHelper').length)
            Swal.fire('Success!', 'You are now ' + $('#becomeHelper').text() + ' calendar helper', 'success')

        //popup file upload
        if ($('#upload-errors').length)
            Swal.fire('Error!', $('#upload-errors').html(), 'error')

        if ($('#upload-success').length)
            Swal.fire('Success!', $('#upload-success').text(), 'success')

        if ($('#upload-warning').length)
            Swal.fire('Warning!', $('#upload-warning').text(), 'warning')

        //targets upload
        $('#targets').on('change', function (e) {
            if (e.target.files.length == 0) return;
            Swal.fire({
                title: 'Are you sure to upload this file?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, upload it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#submit-targets-form').trigger('click')
                }
            })
        })
    },
});
