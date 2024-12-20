const teamMembers = [
    {
        name: "Anete Bite",
        role: "Dizainere",
        experience: "5 gadi",
        email: "anete.bite@gmail.com"
    },
    {
        name: "Linda Loreta Nitiša",
        role: "Programmētāja",
        experience: "3 gadi",
        email: "linda.nitisa@gmail.com"
    }
];

// Funkcija, lai parādītu komandas dalībnieku detaļas HTML lapas beigās
function displayTeamMembers() {
    const teamSection = document.createElement('section');
    teamSection.id = 'team-section';

    const title = document.createElement('h2');
    title.textContent = "Darba autores";
    teamSection.appendChild(title);

    teamMembers.forEach(member => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'team-member';

        const name = document.createElement('h3');
        name.textContent = member.name;
        memberDiv.appendChild(name);

        const role = document.createElement('p');
        role.textContent = `Loma: ${member.role}`;
        memberDiv.appendChild(role);

        const experience = document.createElement('p');
        experience.textContent = `Pieredze: ${member.experience}`;
        memberDiv.appendChild(experience);

        const email = document.createElement('p');
        email.textContent = `E-pasts: ${member.email}`;
        memberDiv.appendChild(email);

        teamSection.appendChild(memberDiv);
    });

    // Pievieno komandas sadaļu lapas apakšā
    document.body.appendChild(teamSection);
}

// Izsauc funkciju, lai parādītu datus lapas apakšā
window.onload = displayTeamMembers;

// CSV datu nolasīšana un apstrāde
async function getData() {
    try {
        const response = await fetch('majdzivnieku-skaits.csv');
        const data = await response.text();
        
        // Sadalām rindas
        const rows = data.split('\n')
            .filter(row => row.trim()); // Izfiltrējam tukšās rindas

        // Iegūstam virsrakstus
        const headers = rows[0].split(';');
        
        // Apstrādājam datus
        const parsedData = rows.slice(1).map(row => {
            const values = row.split(';');
            return {
                teritorija: values[0]?.trim(),
                suni: parseInt(values[1]) || 0,
                kaki: parseInt(values[2]) || 0,
                seski: parseInt(values[3]) || 0
            };
        });

        return parsedData;
    } catch (error) {
        console.error('Kļūda nolasot datus:', error);
        return [];
    }
}

// Diagrammu veidošanas funkcija
async function createCharts() {
    try {
        const data = await getData();
        
        if (!data || data.length === 0) {
            console.error('Nav datu vizualizācijai');
            return;
        }

        // Līniju grafiks kaķiem
        const ctx1 = document.getElementById('chart1');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: data.map(item => item.teritorija),
                    datasets: [{
                        label: 'Kaķu skaits',
                        data: data.map(item => item.kaki),
                        borderColor: '#bc6c25',
                        backgroundColor: 'rgba(188, 108, 37, 0.2)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Kaķu skaits pa teritorijām'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Teritorija'
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Skaits'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Stabiņu grafiks visiem dzīvniekiem
        const ctx2 = document.getElementById('chart2');
        if (ctx2) {
            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.teritorija),
                    datasets: [
                        {
                            label: 'Suņi',
                            data: data.map(item => item.suni),
                            backgroundColor: 'rgba(188, 108, 37, 0.7)',
                            borderColor: 'rgba(188, 108, 37, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Kaķi',
                            data: data.map(item => item.kaki),
                            backgroundColor: 'rgba(96, 108, 54, 0.7)',
                            borderColor: 'rgba(96, 108, 54, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Seski',
                            data: data.map(item => item.seski),
                            backgroundColor: 'rgba(221, 161, 94, 0.7)',
                            borderColor: 'rgba(221, 161, 94, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Mājdzīvnieku skaits pa teritorijām'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Teritorija'
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Skaits'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error('Kļūda veidojot diagrammas:', error);
    }
}

// Izsaucam diagrammu veidošanu, kad lapa ielādējas
window.onload = async function() {
    await createCharts();
    if (document.querySelector('main')) {  // Pārbauda, vai esam about.html lapā
        displayTeamMembers();
    }
};

