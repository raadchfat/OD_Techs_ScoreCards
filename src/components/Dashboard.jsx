import React from 'react';
import { DollarSign, Target, TrendingUp, Users, Droplets, Scissors, Zap, RefreshCw } from 'lucide-react';
import KPICard from './KPICard';
import TechnicianFilter from './TechnicianFilter';
import WeekFilter from './WeekFilter';
import RevenueChart from './Charts/RevenueChart';
import JobStatusChart from './Charts/JobStatusChart';

const Dashboard = ({ 
  kpis, 
  technicians, 
  weeks, 
  selectedTechnician, 
  selectedWeek,
  onTechnicianChange,
  onWeekChange,
  revenueData,
  jobStatusData,
  onResetFilters
}) => {
  const kpiCards = [
    {
      title: 'Average Ticket Value',
      value: kpis.avgTicketValue,
      format: 'currency',
      icon: DollarSign,
      subtitle: `Based on ${kpis.wonJobs} won jobs`
    },
    {
      title: 'Job Close Rate',
      value: kpis.jobCloseRate,
      format: 'percentage',
      icon: Target,
      subtitle: `${kpis.wonJobs} won / ${kpis.totalJobs} total`
    },
    {
      title: 'Weekly Revenue',
      value: kpis.weeklyRevenue,
      format: 'currency',
      icon: TrendingUp,
      subtitle: 'Total revenue from won jobs'
    },
    {
      title: 'Membership Win Rate',
      value: kpis.membershipWinRate,
      format: 'percentage',
      icon: Users,
      subtitle: `${kpis.membershipsSold} sold / ${kpis.membershipOpportunities} opportunities`
    },
    {
      title: 'Hydro Jetting Jobs',
      value: kpis.hydroJettingJobs,
      format: 'number',
      icon: Droplets,
      subtitle: 'Jobs with hydro jetting services'
    },
    {
      title: 'Descaling Jobs',
      value: kpis.descalingJobs,
      format: 'number',
      icon: Scissors,
      subtitle: 'Jobs with descaling services'
    },
    {
      title: 'Water Heater Jobs',
      value: kpis.waterHeaterJobs,
      format: 'number',
      icon: Zap,
      subtitle: 'Jobs with water heater services'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Omaha Drain Techs KPI ScoreCard</h1>
          <p className="text-gray-600 mt-2">
            Weekly performance metrics for service technicians
          </p>
        </div>
        
        <button
          onClick={onResetFilters}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <RefreshCw className="mr-2" size={16} />
          Reset Filters
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TechnicianFilter
          technicians={technicians}
          selectedTechnician={selectedTechnician}
          onTechnicianChange={onTechnicianChange}
        />
        <WeekFilter
          weeks={weeks}
          selectedWeek={selectedWeek}
          onWeekChange={onWeekChange}
        />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {kpiCards.slice(0, 4).map((card, index) => (
          <KPICard key={index} {...card} />
        ))}
      </div>

      {/* Service Jobs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiCards.slice(4).map((card, index) => (
          <KPICard key={index + 4} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart 
          data={revenueData} 
          selectedTechnician={selectedTechnician}
        />
        <JobStatusChart data={jobStatusData} />
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{kpis.totalJobs}</div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">{kpis.wonJobs}</div>
            <div className="text-sm text-gray-600">Won Jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{kpis.membershipOpportunities}</div>
            <div className="text-sm text-gray-600">Membership Opportunities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{kpis.membershipsSold}</div>
            <div className="text-sm text-gray-600">Memberships Sold</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 