$(function () {
    $.get('https://covid-api.mmediagroup.fr/v1/cases', function (data, status) {
        if (status == 'success') {
            const key = 'Global';
            const global_confirmed = data[key]['All']['confirmed'];
            const global_recovered = data[key]['All']['recovered'];
            const global_deaths = data[key]['All']['deaths'];
            const global_mortality = global_deaths / global_confirmed;

            $('#global_confirmed').html(global_confirmed);
            $('#global_recovered').html(global_recovered);
            $('#global_deaths').html(global_deaths);
            $('#global_mortality').html(
                (global_mortality * 100).toFixed(2) + '%'
            );

            countries = [];
            for (const country in data) {
                countries.push(country);
            }

            autocomplete(document.getElementById('country_search'), countries, data);


            const vn_confirmed = data['Vietnam']['All']['confirmed'];
            const vn_recovered = data['Vietnam']['All']['recovered'];
            const vn_deaths = data['Vietnam']['All']['deaths'];
            const vn_mortality = vn_deaths / vn_confirmed;

            $('#vn_confirmed').html(vn_confirmed);
            $('#vn_recovered').html(vn_recovered);
            $('#vn_deaths').html(vn_deaths);
            $('#vn_mortality').html(
                (vn_mortality * 100).toFixed(2) + '%'
            );
        }
    });

    $.get('https://covid-api.mmediagroup.fr/v1/history?country=Global&status=confirmed', function (data, status) {
        const confirmed = data['All']['dates'];

        $.get('https://covid-api.mmediagroup.fr/v1/history?country=Global&status=recovered', function (data, status) {
            const recovered = data['All']['dates'];

            $.get('https://covid-api.mmediagroup.fr/v1/history?country=Global&status=deaths', function (data, status) {
                const deaths = data['All']['dates'];
                const mortality = deaths[Object.keys(deaths)[0]] / confirmed[Object.keys(confirmed)[0]];
                $('#global_confirmed_hist').html(confirmed[Object.keys(confirmed)[0]]);
                $('#global_recovered_hist').html(recovered[Object.keys(recovered)[0]]);
                $('#global_deaths_hist').html(deaths[Object.keys(deaths)[0]]);
                $('#global_mortality_hist').html(
                    (mortality * 100).toFixed(2) + '%'
                );
                options = ''
                for (let i=0; i<7; i++) {
                    options += '<option value="' + i + '">' + Object.keys(confirmed)[i] + '</option>';
                }
                $('#date_select').html(options);
                $('#date_select').change(function() {
                    const i = this.value;
                    const mortality = deaths[Object.keys(deaths)[i]] / confirmed[Object.keys(confirmed)[i]];
                    $('#global_confirmed_hist').html(confirmed[Object.keys(confirmed)[i]]);
                    $('#global_recovered_hist').html(recovered[Object.keys(recovered)[i]]);
                    $('#global_deaths_hist').html(deaths[Object.keys(deaths)[i]]);
                    $('#global_mortality_hist').html(
                        (mortality * 100).toFixed(2) + '%'
                    );
                });
            });
        });
    });

    $.get('https://covid-api.mmediagroup.fr/v1/vaccines?country=Vietnam', function (data, status) {
        $('#vn_administered').html(data['All']['administered']);
        $('#vn_vaccinated').html(data['All']['people_vaccinated']);
        $('#vn_partially_vaccinated').html(data['All']['people_partially_vaccinated']);
    })
});

function autocomplete(inp, arr, data) {
    var currentFocus;
    inp.addEventListener('input', function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (
                arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()
            ) {
                b = document.createElement('DIV');
                b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
                b.addEventListener('click', function (e) {
                    inp.value = this.getElementsByTagName('input')[0].value;
                    closeAllLists();

                    key = inp.value;
                    if (arr.includes(key)) {
                        const global_confirmed = data[key]['All']['confirmed'];
                        const global_recovered = data[key]['All']['recovered'];
                        const global_deaths = data[key]['All']['deaths'];
                        const global_mortality = global_deaths / global_confirmed;

                        $('#first_section_title').html(key + ' statistics');
                        $('#global_confirmed').html(global_confirmed);
                        $('#global_recovered').html(global_recovered);
                        $('#global_deaths').html(global_deaths);
                        $('#global_mortality').html(
                            (global_mortality * 100).toFixed(2) + '%'
                        );
                    }
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener('keydown', function (e) {
        var x = document.getElementById(this.id + 'autocomplete-list');
        if (x) x = x.getElementsByTagName('div');
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        x[currentFocus].classList.add('autocomplete-active');
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove('autocomplete-active');
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName('autocomplete-items');
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener('click', function (e) {
        closeAllLists(e.target);
    });
}
