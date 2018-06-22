#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

Feature: Sample

    Background:
        Given I have deployed the business network definition ..
        And I have added the following asset of type org.xuyuntech.health.RegisterHistory
            | id  | state | created | patient | arrangementHistory |
            |1234|Register|2018-06-22T11:17:43.855Z|resource:org.xuyuntech.health.Patient#5671|resource:org.xuyuntech.health.ArrangementHistory#4313|

    Scenario: 
        When I submit the following transaction of type org.xuyuntech.health.visiting
        | registerHistory|
        |1234|

        Then I should have the following assets of type org.xuyuntech.health.RegisterHistory
            | id  | state | created | patient | arrangementHistory |
            |1234|Visiting|2018-06-22T11:17:43.855Z|resource:org.xuyuntech.health.Patient#5671|resource:org.xuyuntech.health.ArrangementHistory#4313|

