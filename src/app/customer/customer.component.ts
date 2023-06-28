// Angular Import
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { PlaceSearchResult } from './model/place-search-result';
import { Location, LocationStrategy } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// Bootstrap Import
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

// third party
import ApexCharts from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexGrid,
  ApexStroke,
  ApexTooltip
} from 'ng-apexcharts';
import { BerryConfig } from '../app-config';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  colors: string[];
  grid: ApexGrid;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
};
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
 // imports: [CommonModule, SharedModule, NgApexchartsModule],
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {
  navCollapsed: boolean;
  navCollapsedMob: boolean;
// private props
@ViewChild('growthChart') growthChart: ChartComponent;
chartOptions: Partial<ChartOptions>;
@ViewChild('bajajchart') bajajchart: ChartComponent;
chartOptions1: Partial<ChartOptions>;
monthChart: any;
yearChart: any;
colorChart = ['#673ab7'];
fromvalue : PlaceSearchResult | undefined;
tovalue : PlaceSearchResult | undefined;
  windowWidth: number;

// Constructor
constructor(private zone: NgZone, private location: Location, private locationStrategy: LocationStrategy) {

  let current_url = this.location.path();
  if (this.location['_baseHref']) {
    current_url = this.location['_baseHref'] + this.location.path();
  }

  if (current_url === this.location['_baseHref'] + '/layout/theme-compact' || current_url === this.location['_baseHref'] + '/layout/box')
    this.windowWidth = window.innerWidth;
  this.navCollapsed = this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
  this.navCollapsedMob = false;
  this.chartOptions = {
    series: [
      {
        name: 'Investment',
        data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
      },
      {
        name: 'Loss',
        data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
      },
      {
        name: 'Profit',
        data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
      },
      {
        name: 'Maintenance',
        data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
      }
    ],
    dataLabels: {
      enabled: false
    },
    chart: {
      type: 'bar',
      height: 480,
      stacked: true,
      toolbar: {
        show: true
      }
    },
    colors: ['#90caf9', '#1e88e5', '#673ab7', '#ede7f6'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      type: 'category',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    grid: {
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'dark'
    }
  };
  this.chartOptions1 = {
    chart: {
      type: 'area',
      height: 95,
      stacked: true,
      sparkline: {
        enabled: true
      }
    },
    colors: ['#673ab7'],
    stroke: {
      curve: 'smooth',
      width: 1
    },

    series: [
      {
        data: [0, 15, 10, 50, 30, 40, 25]
      }
    ]
  };
}

// Life cycle events
ngOnInit(): void {
<<<<<<< Updated upstream
  setTimeout(() => {
    this.monthChart = new ApexCharts(document.querySelector('#tab-chart-1'), this.monthOptions);
    this.monthChart.render();
  }, 500);
}
=======
//   this.timerSubscription = Observable.timer(0, 1000).pipe( map(() => {  this.getCurrentRequestStatus(1); 
// }
//   ))
const intervalID = setInterval(() => {
  this.getCurrentRequestStatus(1);
}, 1000);
}
 
ngOnDestroy(): void { this.timerSubscription.unsubscribe(); } 
>>>>>>> Stashed changes

// public Method
onNavChange(changeEvent: NgbNavChangeEvent) {
  if (changeEvent.nextId === 1) {
    setTimeout(() => {
      this.monthChart = new ApexCharts(document.querySelector('#tab-chart-1'), this.monthOptions);
      this.monthChart.render();
    }, 200);
  }

  if (changeEvent.nextId === 2) {
    setTimeout(() => {
      this.yearChart = new ApexCharts(document.querySelector('#tab-chart-2'), this.yearOptions);
      this.yearChart.render();
    }, 200);
  }
}

ListGroup = [
  {
    name: 'Bajaj Finery',
    profit: '10% Profit',
    invest: '$1839.00',
    bgColor: 'bg-light-success',
    icon: 'ti ti-chevron-up',
    color: 'text-success'
  },
  {
    name: 'TTML',
    profit: '10% Loss',
    invest: '$100.00',
    bgColor: 'bg-light-danger',
    icon: 'ti ti-chevron-down',
    color: 'text-danger'
  },
  {
    name: 'Reliance',
    profit: '10% Profit',
    invest: '$200.00',
    bgColor: 'bg-light-success',
    icon: 'ti ti-chevron-up',
    color: 'text-success'
  },
  {
    name: 'ATGL',
    profit: '10% Loss',
    invest: '$189.00',
    bgColor: 'bg-light-danger',
    icon: 'ti ti-chevron-down',
    color: 'text-danger'
  },
  {
    name: 'Stolon',
    profit: '10% Profit',
    invest: '$210.00',
    bgColor: 'bg-light-success',
    icon: 'ti ti-chevron-up',
    color: 'text-success'
  }
];

monthOptions = {
  chart: {
    type: 'line',
    height: 90,
    sparkline: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },
  colors: ['#FFF'],
  stroke: {
    curve: 'smooth',
    width: 3
  },
  series: [
    {
      name: 'series1',
      data: [45, 66, 41, 89, 25, 44, 9, 54]
    }
  ],
  yaxis: {
    min: 5,
    max: 95
  },
  tooltip: {
    theme: 'dark',
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function (seriesName) {
          return 'Total Earning';
        }
      }
    },
    marker: {
      show: false
    }
  }
};

yearOptions = {
  chart: {
    type: 'line',
    height: 90,
    sparkline: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },
  colors: ['#FFF'],
  stroke: {
    curve: 'smooth',
    width: 3
  },
  series: [
    {
      name: 'series1',
      data: [35, 44, 9, 54, 45, 66, 41, 69]
    }
  ],
  yaxis: {
    min: 5,
    max: 95
  },
  tooltip: {
    theme: 'dark',
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function (seriesName) {
          return 'Total Earning';
        }
      }
    },
    marker: {
      show: false
    }
  }
};

// public method
navMobClick() {
  if (this.navCollapsedMob && (document.querySelector('app-navigation.coded-navbar') as HTMLDivElement).classList.contains('mob-open')) {
    this.navCollapsedMob = !this.navCollapsedMob;
    setTimeout(() => {
      this.navCollapsedMob = !this.navCollapsedMob;
    }, 100);
  } else {
    this.navCollapsedMob = !this.navCollapsedMob;
  }
}
}
