import * as Highcharts from 'highcharts';
import { Component } from '@angular/core';
import { ComponentGrading } from '../../../classroomMonitor/classroomMonitorComponents/shared/component-grading.component';
import { ProjectService } from '../../../services/projectService';
import { GraphService } from '../graphService';

@Component({
  selector: 'graph-grading',
  templateUrl: 'graph-grading.component.html'
})
export class GraphGrading extends ComponentGrading {
  Highcharts: typeof Highcharts = Highcharts;
  options: any;
  graphType: string;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  isLegendEnabled: boolean = true;
  backgroundImage: string;
  roundValuesTo: string;
  xAxis: any;
  yAxis: any;

  constructor(private GraphService: GraphService, protected ProjectService: ProjectService) {
    super(ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.componentContent = this.ProjectService.injectAssetPaths(this.componentContent);
    this.componentState = this.ProjectService.injectAssetPaths(this.componentState);
    this.graphType = this.componentContent.graphType;
    if (this.graphType == null) {
      this.graphType = 'line';
    }
    this.width = this.componentContent.width;
    this.height = this.componentContent.height;
    this.title = this.componentContent.title;
    this.subtitle = this.componentContent.subtitle;
    if (this.componentContent.hideLegend) {
      this.isLegendEnabled = false;
    }
    this.backgroundImage = this.componentContent.backgroundImage;
    this.roundValuesTo = this.componentContent.roundValuesTo;
    this.xAxis = this.getXAxis(this.componentContent, this.componentState);
    this.yAxis = this.getYAxis(this.componentContent, this.componentState);
    this.xAxis.plotBands = this.GraphService.getPlotBandsFromTrials(
      this.componentState.studentData.trials
    );
    this.drawGraph(this.componentState);
  }

  getXAxis(componentContent: any, componentState: any): any {
    if (componentState.studentData.xAxis != null) {
      return componentState.studentData.xAxis;
    } else {
      return componentContent.xAxis;
    }
  }

  getYAxis(componentContent: any, componentState: any): any {
    if (componentState.studentData.yAxis != null) {
      return componentState.studentData.yAxis;
    } else {
      return componentContent.yAxis;
    }
  }

  drawGraph(componentState: any): void {
    const series = this.GraphService.getSeriesFromTrials(componentState.studentData.trials);
    this.enableMouseTrackingOnAllSeries(series);
    this.options = this.createOptions(
      this.graphType,
      this.width,
      this.height,
      this.title,
      this.subtitle,
      this.backgroundImage,
      this.isLegendEnabled,
      this.roundValuesTo,
      this.xAxis,
      this.yAxis,
      series
    );
  }

  enableMouseTrackingOnAllSeries(series: any[]): void {
    for (const singleSeries of series) {
      singleSeries.enableMouseTracking = true;
    }
  }

  createOptions(
    graphType: string,
    width: number,
    height: number,
    title: string,
    subtitle: string,
    backgroundImage: string,
    isLegendEnabled: boolean,
    roundValuesTo: string,
    xAxis: any,
    yAxis: any,
    series: any[]
  ): any {
    return {
      chart: {
        width: width,
        height: height,
        type: graphType,
        plotBackgroundImage: backgroundImage
      },
      legend: {
        enabled: isLegendEnabled
      },
      series: series,
      subtitle: {
        text: subtitle,
        useHTML: true
      },
      title: {
        text: title,
        useHTML: true
      },
      tooltip: {
        formatter: this.GraphService.createTooltipFormatter(xAxis, yAxis, roundValuesTo)
      },
      xAxis: xAxis,
      yAxis: yAxis,
      credits: {
        enabled: false
      }
    };
  }
}
