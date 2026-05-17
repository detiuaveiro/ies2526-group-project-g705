import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { mockBreakdowns, mockMachines } from '../data/mockData';
import { TrendingUp, Clock, DollarSign, AlertCircle, BarChart3 } from 'lucide-react';
import { Badge } from './ui/badge';

export const ProfitabilityView: React.FC = () => {
  // Calcular estatísticas de rentabilidade
  const resolvedBreakdowns = mockBreakdowns.filter(b => b.resolved);
  const totalCost = resolvedBreakdowns.reduce((sum, b) => sum + b.cost, 0);
  const totalRepairTime = resolvedBreakdowns.reduce((sum, b) => sum + b.repairTime, 0);
  const avgRepairTime = totalRepairTime / resolvedBreakdowns.length;
  const avgCost = totalCost / resolvedBreakdowns.length;

  // Breakdown por máquina com custos
  const machineStats = mockMachines.map(machine => {
    const machineBreakdowns = mockBreakdowns.filter(
      b => b.machineId === machine.id && b.resolved
    );
    const machineCost = machineBreakdowns.reduce((sum, b) => sum + b.cost, 0);
    const machineTime = machineBreakdowns.reduce((sum, b) => sum + b.repairTime, 0);
    
    return {
      machine,
      breakdownCount: machineBreakdowns.length,
      totalCost: machineCost,
      totalTime: machineTime,
      breakdowns: machineBreakdowns.sort((a, b) => b.date.getTime() - a.date.getTime())
    };
  }).filter(item => item.breakdownCount > 0)
    .sort((a, b) => b.totalCost - a.totalCost);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profitability Dashboard</h1>
        <p className="text-gray-600">
          Analysis of machine repair costs and times
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              <div className="text-2xl font-bold">
                €{totalCost.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold">
                {totalRepairTime.toFixed(1)}h
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div className="text-2xl font-bold">
                €{avgCost.toFixed(0)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <div className="text-2xl font-bold">
                {avgRepairTime.toFixed(1)}h
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes por Máquina */}
      <div className="grid gap-6">
        {machineStats.map(({ machine, breakdownCount, totalCost, totalTime, breakdowns }) => (
          <Card key={machine.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {machine.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {machine.location}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="gap-1">
                    <DollarSign className="w-3 h-3" />
                    €{totalCost.toLocaleString()}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {totalTime.toFixed(1)}h
                  </Badge>
                  <Badge variant="secondary">
                    {breakdownCount} Repairs
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                        Date/Time
                      </th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                        Description
                      </th>
                      <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">
                        Repair Time
                      </th>
                      <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdowns.map((breakdown) => (
                      <tr key={breakdown.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {formatDate(breakdown.date)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {breakdown.description}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-medium">
                          {breakdown.repairTime}h
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-bold text-red-600">
                          €{breakdown.cost.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={2} className="py-3 px-4 text-sm">
                        Total
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        {totalTime.toFixed(1)}h
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-red-600">
                        €{totalCost.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
